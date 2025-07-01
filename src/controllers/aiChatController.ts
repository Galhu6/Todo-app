import type { RequestHandler, Request, Response, NextFunction } from "express";
import { OpenAI } from "openai";
import { getChatContext, saveChatContext } from "../services/Chat/chatService.js";
import { getAllLists } from "../services/Lists/listService";
import { getAllTasks } from "../services/Tasks/tasksService";
import { HttpError } from "../middlewares/errorHandler.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const chatWithAi: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { message } = req.body;
    const userId = (req as any).user?.id;
    if (!message || !userId) {
        next(new HttpError(400, "message and user id required"));
        return;
    }
    try {
        const context = await getChatContext(userId);
        const lists = await getAllLists(userId);
        const tasksPromises = lists.map((l: any) => getAllTasks(l.id));
        const tasksArrays = await Promise.all(tasksPromises);
        const tasks = tasksArrays.flat();

        const systemPrompt = `you are a helpful assistant for a TODO app. The user has these lists: ${JSON.stringify(lists)} and tasks: ${JSON.stringify(tasks)}. Conversation context: ${context}`;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }

            ],
            model: "gpt-4o-mini",
        });

        const reply = completion.choices[0]?.message?.content || "";
        await saveChatContext(userId, context + "\nUser: " + message + "\nAI: " + reply);
        res.json({ reply });
    } catch (err) {
        next(err);
    }
}
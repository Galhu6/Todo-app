import type { RequestHandler, Request, Response, NextFunction } from "express";
import { OpenAI } from "openai";
import type { ChatCompletionTool } from "openai/resources";
import { getChatContext, saveChatContext } from "../services/Chat/chatService.js";
import { getUserLists, createList } from "../services/Lists/listService.js";
import { getAllTasks, createTask } from "../services/Tasks/tasksService.js";
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
        const lists = await getUserLists(userId);
        const tasksPromises = lists.map((l: any) => getAllTasks(l.id));
        const tasksArrays = await Promise.all(tasksPromises);
        const tasks = tasksArrays.flat();

        const systemPrompt = `you are a helpful assistant for a TODO app. Each list has an overall_goal to guide its tasks. The user has these lists: ${JSON.stringify(lists)} and tasks: ${JSON.stringify(tasks)}. Conversation context: ${context}`;

        const tools: ChatCompletionTool[] = [
            {
                type: 'function',
                function: {
                    name: 'addList',
                    description: 'create a new todo list',
                    parameters: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', description: 'Name of the list' },
                            overallGoal: { type: 'string', description: 'Overall goal for the list' }
                        },
                        required: ['name']

                    }

                }
            },
            {
                type: 'function',
                function: {
                    name: 'addTask',
                    description: 'Create a new task in a list',
                    parameters: {
                        type: 'object',
                        properties: {
                            listId: { type: 'integer', description: 'Id of the list' },
                            description: { type: 'string', description: 'Task description' },
                            dueDate: { type: 'string', description: 'due date in ISO format' },

                        },
                        required: ['listId', 'description', 'dueDate']
                    }
                }
            }
        ];


        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            tools,
            tool_choice: 'auto',
            model: "gpt-4o-mini",
        });

        const choice = completion.choices[0];
        let reply = choice.message?.content || '';
        if (choice.finish_reason === 'tool_calls' && choice.message?.tool_calls) {
            const call = choice.message.tool_calls[0];
            try {
                const args = JSON.parse(call.function.arguments || '{}');
                if (call.function.name === 'addList') {
                    const newList = await createList(args.name, userId, args.overallGoal);
                    reply = `created list "${newList.name}".`;
                } else if (call.function.name === 'addTask') {
                    const due = new Date(args.dueDate);
                    const listId = parseInt(args.listId);
                    if (isNaN(due.getTime())) {
                        next(new HttpError(400, "invalid due date"));
                        return;
                    }
                    if (!listId || !lists.some((l: any) => l.id === listId)) {
                        next(new HttpError(403, "list does not belong to user"));
                        return;
                    }
                    const newTask = await createTask(args.description, listId, due);
                    reply = `Created task "${newTask.description}" in list ${newTask.listId}`;
                }
            } catch (err) {
                reply = `sorry, I could not process that command`;
            }
        }
        await saveChatContext(userId, context + "\nUser: " + message + "\nAI: " + reply);
        res.json({ reply });
    } catch (err) {
        next(err);
    }
};

export const getChatHistory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) {
        next(new HttpError(401, "user id required"));
        return;
    }
    try {
        const context = await getChatContext(userId);
        res.json({ context });
    } catch (err) {
        next(err);
    }
};
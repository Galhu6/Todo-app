import type { RequestHandler, Request, Response, NextFunction } from "express";
import { OpenAI } from "openai";
import type { ChatCompletionTool } from "openai/resources";
import { getChatContext, saveChatContext } from "../services/Chat/chatService.js";
import { getUserLists, createList } from "../services/Lists/listService.js";
import { getAllTasks, createTask } from "../services/Tasks/tasksService.js";
import { createMicroTask } from "../services/MicroTasks/microTaskService.js";
import { getUserStats, getRecommendations, getDailySummary } from "../services/Stats/statsService.js";
import { sendWhatsApp } from "../services/Whatsapp/whatsappService.js";
import { creatCalendarEvent } from "../services/Calendar/calendarService.js";
import { HttpError } from "../middlewares/errorHandler.js";
import { QUOTES, TIPS } from "../utils/motivations.js";


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
            },
            {
                type: 'function',
                function: {
                    name: 'addSubList',
                    description: 'create a sub list under an existing list',
                    parameters: {
                        type: 'object',
                        properties: {
                            parentListId: { type: 'integer', description: 'Id of parent list' },
                            name: { type: 'string', description: 'Name of the sub list' },
                            overallGoal: { type: 'string', description: 'Overall goal for  sub list' }
                        },
                        required: ['parentListId', 'name']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'addMicroTask',
                    description: 'create a micro task linked to a task',
                    parameters: {
                        type: 'object',
                        properties: {
                            taskId: { type: 'integer', description: 'Parent task id' },
                            description: { type: 'string', description: 'Micro task description' },
                        },
                        required: ['taskId', 'description']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'recommendTasks',
                    description: 'get task reccomendations for the user',
                    parameters: {
                        type: 'object',
                        properties: {},
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'getStats',
                    description: 'return statistics about tasks',
                    parameters: {
                        type: 'object',
                        properties: {},
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'sendWhatsapp',
                    description: 'send a Whatsapp message to the user',
                    parameters: {
                        type: 'object',
                        properties: {
                            phone: { type: 'string', description: 'Recipient phone number' },
                            body: { type: 'string', description: 'Message body' },
                        },
                        required: ['phone', 'body']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'dailySummary',
                    description: 'get a summary of today\'s tasks',
                    parameters: {
                        type: 'object',
                        properties: {
                            part: { type: 'integer', enum: ['morning', 'evening'] },
                        },
                        required: ['part']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'addCalenderEvent',
                    description: 'add an event to Google calender',
                    parameters: {
                        type: 'object',
                        properties: {
                            accessToken: { type: 'string' },
                            summary: { type: 'string' },
                            description: { type: 'string' },
                            startTime: { type: 'string' },
                            endTime: { type: 'string' }
                        },
                        required: ['accessToken', 'summary', 'startTime', 'endTime']
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'motivation',
                    description: 'get a random motivational quote',
                    parameters: {
                        type: 'object',
                        properties: {}
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'productivityTip',
                    description: 'get a random productivity tip',
                    parameters: {
                        type: 'object',
                        properties: {}
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
                } else if (call.function.name === 'addSubList') {
                    const parentId = parseInt(args.parentListId);
                    if (!parentId || !lists.some((l: any) => l.id === parentId)) {
                        next(new HttpError(403, 'parent list dows not belong to user'));
                        return;
                    }
                    const sub = await createList(args.name, userId, args.overallGoal, parentId);
                    reply = `Created sublist ${sub.name} under list ${parentId}`;
                } else if (call.function.name === 'addMicroTask') {
                    const taskId = parseInt(args.taskId);
                    if (!taskId || !tasks.some((t: any) => t.id = taskId)) {
                        next(new HttpError(404, 'task not found'));
                        return;
                    }
                    const mt = await createMicroTask(args.description, taskId);
                    reply = `create micro task "${mt.description}"`;
                } else if (call.function.name === "recomendedTasks") {
                    const recs = await getRecommendations(userId);
                    reply = 'Recommended tasks: ' + recs.map(r => r.description).join(', ');
                } else if (call.function.name === 'getStats') {
                    const stats = await getUserStats(userId);
                    reply = `Completed: ${stats.completed}, Pending: ${stats.pending}, Overdue: ${stats.overdue}`;
                } else if (call.function.name === 'sendWhatsApp') {
                    await sendWhatsApp(args.phone, args.body);
                    reply = 'WhatsApp message sent';
                } else if (call.function.name === 'dailySummary') {
                    const summary = await getDailySummary(userId, args.part);
                    const list = summary.tasks.map((t: any) => t.description).join(', ');
                    reply = `${args.part} summary: ${list}`;
                } else if (call.function.name === 'addCalenderEvent') {
                    await creatCalendarEvent(args.accessToken, {
                        summary: args.summary,
                        description: args.description,
                        startTime: args.startTime,
                        endTime: args.endTime
                    });
                    reply = 'calendar event added';
                } else if (call.function.name === 'motivation') {
                    reply = QUOTES[Math.floor(Math.random() * QUOTES.length)];
                } else if (call.function.name === 'productivityTip') {
                    reply = TIPS[Math.floor(Math.random() * TIPS.length)];
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
import { getDashboardStats } from "../services/stats.service";
import { Request, Response } from "express";



export const getStatsController = async (_req: Request, res: Response) => {
    try {
        const stats = await getDashboardStats();
        return res.status(200).json({
            success: true,
            data: stats,
            message: "Dashboard stats fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats",
            error: (error as Error).message,
        });
    }
};

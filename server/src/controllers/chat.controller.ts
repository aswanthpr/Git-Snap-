import type { Request, Response, NextFunction } from "express";
import { redis } from "../configs/index";
import { createHttpError } from "../utils";
import {HttpResponse, HttpStatus } from "../constants";



export const getChatHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse?.REQUIRED_SESSION_ID );
    }

    const key = `session`;
     await redis?.get(key);
   

    res.status(HttpStatus.OK).json({
      success: true,
      message: HttpResponse.SUCCESS,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const createSession = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try{

    const initialHistory:[] = []//chatHistory || [];

    await redis?.set(
      `session`,
      JSON.stringify(initialHistory),
      "EX",
60
    );
console.log('session created')
    res.status(HttpStatus?.OK).json({
      success: true,
      message: HttpResponse?.SESSION_CREATED,
    });

  } catch (error: unknown) {
    next(error);
  }
};

export const resetSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      throw createHttpError(
        HttpStatus?.BAD_REQUEST,
        HttpResponse?.REQUIRED_SESSION_ID
      );
    }
    // del old session & HISTORY
    await redis?.del(`session:${sessionId}`);

    //create new uuid and store

    //create new session with history[]
    await redis?.set(`session`, JSON.stringify([]));

    res.status(HttpStatus.OK).json({
      success: true,
      message: HttpResponse?.SUCCESS,

    });

  } catch (error: unknown) {
    next(error);
  }
};

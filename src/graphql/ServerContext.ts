import { Request, Response } from "express";
import { Services } from "../core/service";

export interface ServerContext {
    request: Request;
    response: Response;
    services: Services;
}
import { Request, Response } from "express";
import { Repository } from "../repository/service";

export interface ServerContext {
    request: Request;
    response: Response;
    services: Repository;
}
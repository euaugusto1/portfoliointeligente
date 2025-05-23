import { Express } from "express";
import { storage } from "./storage";
import { isAdmin, isAuthenticated } from "./auth";
import { insertAgentPromptSchema, insertAgentSchema } from "@shared/schema";

export function setupApiRoutes(app: Express) {
  // API routes para agentes
  app.get("/api/agents", async (req, res, next) => {
    try {
      const agents = await storage.getAgents();
      res.json(agents);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/agents/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const agent = await storage.getAgent(id);
      if (!agent) {
        return res.status(404).json({ error: "Agente não encontrado" });
      }

      res.json(agent);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/agents", isAdmin, async (req, res, next) => {
    try {
      const validationResult = insertAgentSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Dados inválidos", details: validationResult.error });
      }

      const newAgent = await storage.createAgent(validationResult.data);
      res.status(201).json(newAgent);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/agents/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const validationResult = insertAgentSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Dados inválidos", details: validationResult.error });
      }

      const updatedAgent = await storage.updateAgent(id, validationResult.data);
      if (!updatedAgent) {
        return res.status(404).json({ error: "Agente não encontrado" });
      }

      res.json(updatedAgent);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/agents/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      // Verifica se existe
      const agent = await storage.getAgent(id);
      if (!agent) {
        return res.status(404).json({ error: "Agente não encontrado" });
      }

      await storage.deleteAgent(id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

  // API routes para prompts de agentes
  app.get("/api/agents/:agentId/prompts", async (req, res, next) => {
    try {
      const agentId = parseInt(req.params.agentId);
      if (isNaN(agentId)) {
        return res.status(400).json({ error: "ID de agente inválido" });
      }

      // Verifica se o agente existe
      const agent = await storage.getAgent(agentId);
      if (!agent) {
        return res.status(404).json({ error: "Agente não encontrado" });
      }

      const prompts = await storage.getAgentPrompts(agentId);
      res.json(prompts);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/agents/:agentId/active-prompt", async (req, res, next) => {
    try {
      const agentId = parseInt(req.params.agentId);
      if (isNaN(agentId)) {
        return res.status(400).json({ error: "ID de agente inválido" });
      }

      // Verifica se o agente existe
      const agent = await storage.getAgent(agentId);
      if (!agent) {
        return res.status(404).json({ error: "Agente não encontrado" });
      }

      const prompt = await storage.getActiveAgentPrompt(agentId);
      if (!prompt) {
        return res.status(404).json({ error: "Nenhum prompt ativo encontrado para este agente" });
      }

      res.json(prompt);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/agents/:agentId/prompts", isAdmin, async (req, res, next) => {
    try {
      const agentId = parseInt(req.params.agentId);
      if (isNaN(agentId)) {
        return res.status(400).json({ error: "ID de agente inválido" });
      }

      // Verifica se o agente existe
      const agent = await storage.getAgent(agentId);
      if (!agent) {
        return res.status(404).json({ error: "Agente não encontrado" });
      }

      // Inclui o agentId no corpo da requisição
      const data = { ...req.body, agentId };
      const validationResult = insertAgentPromptSchema.safeParse(data);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Dados inválidos", details: validationResult.error });
      }

      const newPrompt = await storage.createAgentPrompt(validationResult.data);
      res.status(201).json(newPrompt);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/agent-prompts/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const validationResult = insertAgentPromptSchema.partial().safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Dados inválidos", details: validationResult.error });
      }

      const updatedPrompt = await storage.updateAgentPrompt(id, validationResult.data);
      if (!updatedPrompt) {
        return res.status(404).json({ error: "Prompt não encontrado" });
      }

      res.json(updatedPrompt);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/agent-prompts/:id", isAdmin, async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      await storage.deleteAgentPrompt(id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });
}
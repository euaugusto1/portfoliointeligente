import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Hook para gerenciar o sessionID
export const useSessionId = () => {
  const [sessionId, setSessionId] = useState<string>('');
  
  useEffect(() => {
    // Verifica se já existe um sessionId no localStorage
    let id = localStorage.getItem('nexusai_session_id');
    
    // Se não existir, cria um novo e salva no localStorage
    if (!id) {
      id = uuidv4();
      localStorage.setItem('nexusai_session_id', id);
    }
    
    console.log('Session ID:', id);
    setSessionId(id);
  }, []);
  
  return sessionId;
};

// Hook para obter o logotipo da variável de ambiente
export const useLogoFromEnv = () => {
  const [logoUrl, setLogoUrl] = useState<string>('');
  
  useEffect(() => {
    const envLogo = import.meta.env.VITE_LOGO_URL;
    const defaultLogo = 'https://static.vecteezy.com/system/resources/previews/009/384/620/original/ai-tech-artificial-intelligence-clipart-design-illustration-free-png.png';
    
    const logoSrc = envLogo || defaultLogo;
    console.log('VITE_LOGO_URL ou URL padrão:', logoSrc);
    setLogoUrl(logoSrc);
  }, []);
  
  return logoUrl;
};

// Hook para obter a URL do webhook da variável de ambiente
export const useWebhookUrl = () => {
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  
  useEffect(() => {
    const envWebhookUrl = import.meta.env.VITE_WEBHOOK_URL;
    const defaultWebhookUrl = 'https://webhook.dev.iaassistente.store/webhook/portfolio_virtual';
    
    const finalWebhookUrl = envWebhookUrl || defaultWebhookUrl;
    console.log('VITE_WEBHOOK_URL ou URL padrão:', finalWebhookUrl);
    setWebhookUrl(finalWebhookUrl);
  }, []);
  
  return webhookUrl;
};

// Hook para obter o link do WhatsApp da variável de ambiente
export const useWhatsAppLink = () => {
  const [whatsappLink, setWhatsAppLink] = useState<string>('');
  
  useEffect(() => {
    const envWhatsAppNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
    const defaultWhatsAppNumber = '5544999998888';
    
    const whatsAppNumber = envWhatsAppNumber || defaultWhatsAppNumber;
    const finalWhatsAppLink = `https://wa.me/${whatsAppNumber}`;
    
    console.log('VITE_WHATSAPP_NUMBER ou número padrão:', whatsAppNumber);
    setWhatsAppLink(finalWhatsAppLink);
  }, []);
  
  return whatsappLink;
};
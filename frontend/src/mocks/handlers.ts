import { http, HttpResponse, delay } from 'msw';
import { standardsFixture } from './fixtures/standards';
import { certificationSchemesFixture } from './fixtures/certificationSchemes';

import { laboratoriesFixture } from './fixtures/laboratories';
import { servicesFixture } from './fixtures/services';
import { documentsFixture } from './fixtures/documents';
import { conversationsFixture } from './fixtures/conversations';
import { chatResponsesFixture } from './fixtures/chatResponses';
import { languagesFixture } from './fixtures/languages';
import { GroundedAnswer } from '@/types/chat';
import { generateId } from '@/lib/utils';

export const handlers = [
  http.post('/api/chat', async ({ request }) => {
    await delay(1500);
    const body = await request.json() as { message: string };
    const query = body.message.toLowerCase();

    const defaultAnswer = chatResponsesFixture.default!;
    let answerObj: GroundedAnswer = defaultAnswer;
    if (query.includes('water') || query.includes('drinking') || query.includes('10500')) answerObj = chatResponsesFixture.water ?? defaultAnswer;
    else if (query.includes('concrete') || query.includes('456')) answerObj = chatResponsesFixture.concrete ?? defaultAnswer;
    else if (query.includes('led') || query.includes('bulb') || query.includes('16102')) answerObj = chatResponsesFixture.led ?? defaultAnswer;
    else if (query.includes('302') || query.includes('clause 7.2')) answerObj = chatResponsesFixture.is302 ?? defaultAnswer;
    else if (query.includes('hallmark') || query.includes('gold')) answerObj = chatResponsesFixture.hallmarking ?? defaultAnswer;
    else if (query.includes('certificat') || query.includes('isi')) answerObj = chatResponsesFixture.certification ?? defaultAnswer;

    return HttpResponse.json({
      message: {
        id: generateId(),
        conversationId: generateId(),
        role: 'assistant',
        content: answerObj.answerMarkdown,
        status: 'complete',
        language: 'en',
        createdAt: new Date().toISOString(),
        answer: answerObj
      },
      conversationId: generateId(),
      conversationTitle: 'New Conversation'
    });
  }),

  http.post('/api/search', async () => {
    return HttpResponse.json([]);
  }),

  http.get('/api/standards', () => HttpResponse.json({ items: standardsFixture, page: 1, pageSize: 20, total: standardsFixture.length, hasMore: false })),
  http.get('/api/standards/:id', ({ params }) => HttpResponse.json(standardsFixture.find(s => s.id === params.id) || standardsFixture[0])),

  http.get('/api/sources/:id', () => HttpResponse.json({ id: 'src-1', title: 'Source', citationIndex: 1, documentId: 'doc-1', documentName: 'Doc', sourceType: 'indian_standard', authority: 'BIS', isOfficial: true, isDemo: true, relevance: 'high' })),

  http.get('/api/documents/:id', ({ params }) => HttpResponse.json(documentsFixture.find(d => d.id === params.id) || documentsFixture[0])),

  http.get('/api/conversations', () => HttpResponse.json({ items: conversationsFixture, page: 1, pageSize: 20, total: conversationsFixture.length, hasMore: false })),
  http.post('/api/conversations', async () => HttpResponse.json({ id: generateId(), title: 'New', language: 'en', messageCount: 0, isArchived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })),
  http.get('/api/conversations/:id', ({ params }) => HttpResponse.json(conversationsFixture.find(c => c.id === params.id) || conversationsFixture[0])),
  http.delete('/api/conversations/:id', () => new HttpResponse(null, { status: 204 })),
  http.put('/api/conversations/:id', async () => HttpResponse.json(conversationsFixture[0])),

  http.post('/api/feedback', () => new HttpResponse(null, { status: 204 })),

  http.get('/api/languages', () => HttpResponse.json(languagesFixture)),

  http.get('/api/health', () => HttpResponse.json({ status: 'healthy', version: '0.1.0', mode: 'demo' })),

  http.get('/api/services', () => HttpResponse.json({ items: servicesFixture, page: 1, pageSize: 20, total: servicesFixture.length, hasMore: false })),
  http.get('/api/services/:id', ({ params }) => HttpResponse.json(servicesFixture.find(s => s.id === params.id) || servicesFixture[0])),

  http.get('/api/labs', () => HttpResponse.json({ items: laboratoriesFixture, page: 1, pageSize: 20, total: laboratoriesFixture.length, hasMore: false })),
  http.get('/api/labs/:id', ({ params }) => HttpResponse.json(laboratoriesFixture.find(l => l.id === params.id) || laboratoriesFixture[0])),

  http.get('/api/certification/schemes', () => HttpResponse.json(certificationSchemesFixture)),
  http.get('/api/certification/schemes/:id', ({ params }) => HttpResponse.json(certificationSchemesFixture.find(s => s.id === params.id) || certificationSchemesFixture[0]))
];

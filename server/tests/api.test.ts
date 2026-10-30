import { describe,it,expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('case and playthrough API',()=>{
 it('keeps the canonical answer private until one final accusation',async()=>{
  const created=await request(app).post('/api/v1/cases').send({premise:'A prototype vanishes from a university lab just before its public showcase.'});
  expect(created.status).toBe(201);
  expect(created.body.case).not.toHaveProperty('solution');
  expect(created.body.case).not.toHaveProperty('culpritId');
  const {id,token}=created.body.playthrough;
  expect(token).toBeTruthy();
  const access=await request(app).get(`/api/v1/cases/${created.body.case.id}`).query({playthroughId:id});
  expect(access.status).toBe(404);
  const unauthorized=await request(app).get(`/api/v1/cases/${created.body.case.id}`).query({playthroughId:id}).set('x-playthrough-token','wrong-token');
  expect(unauthorized.status).toBe(404);
  const headers={'x-playthrough-token':token};
  const choice=created.body.case.suspects[0].id;
  const contenders=await Promise.all([request(app).post(`/api/v1/playthroughs/${id}/accusation`).set(headers).send({suspectId:choice}),request(app).post(`/api/v1/playthroughs/${id}/accusation`).set(headers).send({suspectId:created.body.case.suspects[1].id})]);
  const reveal=contenders.find(response=>response.status===200);
  expect(reveal).toBeTruthy();
  expect(contenders.filter(response=>response.status===409)).toHaveLength(1);
  expect(['correct','incorrect']).toContain(reveal!.body.verdict);
  expect(reveal!.body.reasoningSteps.length).toBeGreaterThan(0);
  const resume=await request(app).get(`/api/v1/playthroughs/${id}`).set(headers);
  expect(resume.body.reveal.culprit.name).toBe(reveal!.body.culprit.name);
 });
 it('rejects malformed case creation input',async()=>{
  const response=await request(app).post('/api/v1/cases').send({premise:'Too short'});
  expect(response.status).toBe(400);
 });
});

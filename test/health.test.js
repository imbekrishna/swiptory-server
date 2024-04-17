import { test } from 'vitest'
import supertest from 'supertest'
import app from '../app'

const api = supertest(app)

test('health check passes', async () => {
  await api
    .get('/api/health')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

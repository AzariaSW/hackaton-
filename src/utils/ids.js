import { randomUUID } from 'node:crypto';

export const uuid = () => randomUUID();

export const generateId = (prefix) => `${prefix}_${randomUUID().replaceAll('-', '')}`;

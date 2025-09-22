
import { ContentType } from './types';

export const CONTENT_TYPE_OPTIONS: ContentType[] = Object.values(ContentType);

export const ANONYMOUS_GENERATIONS_LIMIT = 3;
export const EMAIL_GENERATIONS_LIMIT = 3;
export const TOTAL_FREE_GENERATIONS = ANONYMOUS_GENERATIONS_LIMIT + EMAIL_GENERATIONS_LIMIT;

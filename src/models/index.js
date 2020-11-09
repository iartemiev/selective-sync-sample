// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const { User, Test } = initSchema(schema);

export { User, Test };

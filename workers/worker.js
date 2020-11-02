import { DataStore, Predicates } from '@aws-amplify/datastore';
import { Amplify } from '@aws-amplify/core';
import awsconfig from '@/aws-exports';
import { User } from '@/models';

Amplify.configure(awsconfig);
export async function setup() {
	console.log('starting worker');
	const users = await DataStore.query(User, Predicates.ALL, { limit: 100 });
	console.log('worker users', users);
}

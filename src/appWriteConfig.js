import { Client,Databases,Functions,Storage,Account } from 'appwrite';
const client = new Client();

export const ENDPOINT = import.meta.env.VITE_ENDPOINT
export const PROJECT_ID = import.meta.env.VITE_PROJECT_ID
export const DB_ID = import.meta.env.VITE_DB_ID
export const COLLECTION_ID_THREADS = import.meta.env.VITE_COLLECTION_ID_THREADS
export const BUCKET_ID_IMAGES = import.meta.env.VITE_BUCKET_ID_IMAGES
export const COLLECTION_ID_PROFILES = import.meta.env.VITE_COLLECTION_ID_PROFILES
export const COLLECTION_ID_COMMENTS = import.meta.env.VITE_COLLECTION_ID_COMMENTS

client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);

    export const functions = new Functions(client);
    export const database = new Databases(client);
    export const storage = new Storage(client);
    export const account = new Account(client);
    export default client;
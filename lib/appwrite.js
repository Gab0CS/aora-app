import { Platform } from "react-native";
import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.gabo.aora',
    projectId: '6657b2dc0000b8bc531c',
    databaseId: '6657b4dc0005a2f64689',
    userCollectionId: '6657b5010035eea19ee8',
    videoColectionId: '6657b51c0016846e8e0d',
    storageId: '6657b67300329445c1c0    '
}


const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform) 
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client)

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password)

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser;

    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const signIn = async (email, password) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }

//1:54

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        
        if(!currentAccount)  throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        console.log(error)
    }
}

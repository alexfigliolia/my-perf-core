/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export enum JobStatus {
  Complete = 'complete',
  Failed = 'failed',
  Pending = 'pending'
}

export type Mutation = {
  __typename?: 'Mutation';
  registerRepositoryPull: Scalars['Int']['output'];
  registerRepositoryStatsPull: Scalars['Int']['output'];
  setJobStatus: Scalars['Boolean']['output'];
};


export type MutationRegisterRepositoryPullArgs = {
  api_url: Scalars['String']['input'];
  organizationId: Scalars['Int']['input'];
  platform: Platform;
  requestMethod: RequestMethod;
  token: Scalars['String']['input'];
};


export type MutationRegisterRepositoryStatsPullArgs = {
  clone_url: Scalars['String']['input'];
  organizationId: Scalars['Int']['input'];
  repositoryId: Scalars['Int']['input'];
  token: Scalars['String']['input'];
};


export type MutationSetJobStatusArgs = {
  id: Scalars['Int']['input'];
  status: JobStatus;
};

export enum Platform {
  Bitbucket = 'bitbucket',
  Github = 'github'
}

export type Query = {
  __typename?: 'Query';
  nextPullJob: RepositoryPullJob;
};

export type RepositoryPullJob = {
  __typename?: 'RepositoryPullJob';
  api_url: Scalars['String']['output'];
  currentPage: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  jobId: Scalars['Int']['output'];
  organizationId: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  platform: Platform;
  requestMethod: RequestMethod;
  token: Scalars['String']['output'];
};

export enum RequestMethod {
  Get = 'GET',
  Post = 'POST'
}

export type Subscription = {
  __typename?: 'Subscription';
  repositoryPulls: RepositoryPullJob;
};

export type RegisterRepositoryPullMutationVariables = Exact<{
  token: Scalars['String']['input'];
  api_url: Scalars['String']['input'];
  platform: Platform;
  organizationId: Scalars['Int']['input'];
  requestMethod: RequestMethod;
}>;


export type RegisterRepositoryPullMutation = { __typename?: 'Mutation', registerRepositoryPull: number };


export const RegisterRepositoryPullDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"registerRepositoryPull"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"api_url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"platform"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Platform"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requestMethod"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestMethod"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerRepositoryPull"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"api_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"api_url"}}},{"kind":"Argument","name":{"kind":"Name","value":"platform"},"value":{"kind":"Variable","name":{"kind":"Name","value":"platform"}}},{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"requestMethod"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requestMethod"}}}]}]}}]} as unknown as DocumentNode<RegisterRepositoryPullMutation, RegisterRepositoryPullMutationVariables>;
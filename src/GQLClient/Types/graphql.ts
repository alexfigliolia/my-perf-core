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

export type GithubPullResult = {
  __typename?: 'GithubPullResult';
  jobId: Scalars['Int']['output'];
  repos: Array<GithubRepository>;
  status: Status;
};

export type GithubRepository = {
  __typename?: 'GithubRepository';
  clone_url: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  html_url: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  language?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export enum InstallationType {
  Individual = 'individual',
  Organization = 'organization'
}

export type Mutation = {
  __typename?: 'Mutation';
  pullGithubRepositories: GithubPullResult;
  resumeGithubPull: GithubPullResult;
};


export type MutationPullGithubRepositoriesArgs = {
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  platform: Platform;
  token: Scalars['String']['input'];
  type: InstallationType;
};


export type MutationResumeGithubPullArgs = {
  id: Scalars['Int']['input'];
  token: Scalars['String']['input'];
};

export enum Platform {
  Bitbucket = 'bitbucket',
  Github = 'github'
}

export type Query = {
  __typename?: 'Query';
  hello?: Maybe<Scalars['String']['output']>;
};

export enum Status {
  Complete = 'complete',
  Incomplete = 'incomplete'
}

export type PullGithubRepositoriesMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  platform: Platform;
  type: InstallationType;
  token: Scalars['String']['input'];
}>;


export type PullGithubRepositoriesMutation = { __typename?: 'Mutation', pullGithubRepositories: { __typename?: 'GithubPullResult', jobId: number, status: Status, repos: Array<{ __typename?: 'GithubRepository', id: number, name: string, description?: string | null, html_url: string, clone_url: string, language?: string | null, url: string }> } };

export type ResumeGithubPullMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  token: Scalars['String']['input'];
}>;


export type ResumeGithubPullMutation = { __typename?: 'Mutation', resumeGithubPull: { __typename?: 'GithubPullResult', jobId: number, status: Status, repos: Array<{ __typename?: 'GithubRepository', id: number, name: string, description?: string | null, html_url: string, clone_url: string, language?: string | null, url: string }> } };


export const PullGithubRepositoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"pullGithubRepositories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"platform"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Platform"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InstallationType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pullGithubRepositories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"platform"},"value":{"kind":"Variable","name":{"kind":"Name","value":"platform"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"repos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"html_url"}},{"kind":"Field","name":{"kind":"Name","value":"clone_url"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<PullGithubRepositoriesMutation, PullGithubRepositoriesMutationVariables>;
export const ResumeGithubPullDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"resumeGithubPull"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resumeGithubPull"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"repos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"html_url"}},{"kind":"Field","name":{"kind":"Name","value":"clone_url"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<ResumeGithubPullMutation, ResumeGithubPullMutationVariables>;
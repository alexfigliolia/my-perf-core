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

export type Contributions = {
  __typename?: 'Contributions';
  totalCommits: Scalars['Int']['output'];
  totalLines: Scalars['Int']['output'];
  users: Array<UserContributions>;
};

export type Mutation = {
  __typename?: 'Mutation';
  pullContributions: Contributions;
};


export type MutationPullContributionsArgs = {
  clone_url: Scalars['String']['input'];
  emails: Array<Scalars['String']['input']>;
  token: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  hello?: Maybe<Scalars['String']['output']>;
};

export type UserContributions = {
  __typename?: 'UserContributions';
  commits: Scalars['Int']['output'];
  email: Scalars['String']['output'];
  lines: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type PullContributionsMutationVariables = Exact<{
  token: Scalars['String']['input'];
  clone_url: Scalars['String']['input'];
  emails: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type PullContributionsMutation = { __typename?: 'Mutation', pullContributions: { __typename?: 'Contributions', totalLines: number, totalCommits: number, users: Array<{ __typename?: 'UserContributions', name: string, email: string, lines: number, commits: number }> } };


export const PullContributionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"pullContributions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clone_url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"emails"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pullContributions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"clone_url"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clone_url"}}},{"kind":"Argument","name":{"kind":"Name","value":"emails"},"value":{"kind":"Variable","name":{"kind":"Name","value":"emails"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"lines"}},{"kind":"Field","name":{"kind":"Name","value":"commits"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalLines"}},{"kind":"Field","name":{"kind":"Name","value":"totalCommits"}}]}}]}}]} as unknown as DocumentNode<PullContributionsMutation, PullContributionsMutationVariables>;
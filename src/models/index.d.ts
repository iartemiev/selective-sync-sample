import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class Test {
  readonly id: string;
  constructor(init: ModelInit<Test>);
  static copyOf(source: Test, mutator: (draft: MutableModel<Test>) => MutableModel<Test> | void): Test;
}

export declare class User {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly username: string;
  readonly jobTitle?: string;
  readonly sortOrder?: number;
  constructor(init: ModelInit<User>);
  static copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}
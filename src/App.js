import React, { useState, useEffect } from 'react';
import './App.css';
import mocker from 'mocker-data-generator';
import Amplify, {
  Hub,
  DataStore,
  Predicates,
  syncExpression,
} from 'aws-amplify';
// import { DataStore, Predicates, syncExpression } from '@aws-amplify/datastore';

import awsconfig from './aws-exports.js';
import { User } from './models';

Amplify.Logger.LOG_LEVEL = 'DEBUG';
Amplify.configure(awsconfig);

const DUMMYCOUNT = 10;

DataStore.configure({
  maxRecordsToSync: 30000,
  syncPageSize: 10000,
  syncExpressions: [
    syncExpression(User, (c) =>
      c.id('eq', 'e56c79bf-2490-4301-8384-e9990ba0a17e')
    ),
  ],
});

async function createDummyData() {
  const jobTitles = ['Intern', 'SDM', 'SDE', 'FEE', 'Director', 'VP'];
  const user = {
    firstName: {
      faker: 'name.firstName',
    },
    lastName: {
      faker: 'name.lastName',
    },
    username: {
      function: function () {
        return (
          this.object.lastName.substring(0, 5) +
          this.object.firstName.substring(0, 3) +
          Math.floor(Math.random() * 10)
        );
      },
    },
    jobTitle: {
      function: function () {
        const idx = Math.floor(Math.random() * jobTitles.length);
        return jobTitles[idx];
      },
    },
    sortOrder: { faker: 'random.number' },
  };

  const { users } = await mocker().schema('users', user, DUMMYCOUNT).build();
  console.log('dummies: ', users.length, users);
  return users;
}

function App() {
  const [ready, setReady] = useState(false);
  const [users, setUsers] = useState([]);

  let userSub = null;

  useEffect(() => {
    const removeListener = Hub.listen(
      'datastore',
      async ({ payload: { event } }) => {
        console.log('HUB', event);
        if (event === 'ready') {
          setReady(true);
          getAllUsers();
          return;
        }
        if (event === 'syncQueriesStarted') {
          setReady(false);
          return;
        }
      }
    );

    getAllUsers();
    initiateUserSubscription();

    return () => {
      userSub && userSub.unsubscribe();
      removeListener();
    };
  }, []);

  function initiateUserSubscription() {
    userSub = DataStore.observe(User).subscribe(({ element, opType }) => {
      const opTypeUpdaters = {
        DELETE: (users) => users.filter((user) => user.id !== element.id),
        INSERT: (users) => [element, ...users],
        UPDATE: (users) =>
          users.map((user) => (user.id === element.id ? element : user)),
      };

      setUsers(opTypeUpdaters[opType]);
    });
  }

  async function getAllUsers() {
    const items = await DataStore.query(User);
    setUsers(items);
  }

  async function generateUsers() {
    const dummies = await createDummyData();
    await saveUsers(dummies);
    console.log('done');
  }

  async function saveUsers(newUsers) {
    await Promise.all(
      newUsers.map(
        async ({ firstName, lastName, username, jobTitle, sortOrder }) => {
          await DataStore.save(
            new User({
              firstName,
              lastName,
              username,
              jobTitle,
              sortOrder,
            })
          );
        }
      )
    );
  }

  async function deleteAll() {
    console.log('deleting all');
    await DataStore.delete(User, Predicates.ALL);
  }

  async function clearStart() {
    await DataStore.clear();
    await DataStore.start();
    initiateUserSubscription();
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={generateUsers}>Save {DUMMYCOUNT} New Records</button>
        <button onClick={clearStart}>Clear & Start</button>
        <button style={styles.deleteBtn} onClick={deleteAll}>
          Delete All
        </button>
        <p data-test="app-ready">Ready: {ready ? 'Y' : 'N'}</p>
        <p>{users.length} items in state</p>
        <pre>{navigator.onLine ? 'Online' : 'offline'}</pre>
        <pre>{JSON.stringify(users, null, 2)} </pre>
      </header>
    </div>
  );
}

export default App;

const styles = {
  deleteBtn: {
    backgroundColor: 'red',
    marginTop: '20px',
  },
};

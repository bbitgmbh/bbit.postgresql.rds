import { Client as DataApiClient } from './client';

const dbUrl = process.env.AURORA_TEST_DB_URL;

console.log(dbUrl);

describe('Simulate raw postgres client', () => {
  test('simple string query', async () => {
    const client = new DataApiClient(dbUrl);

    console.log(client.dataApiGetAWSConfig());

    await client.connect();
    const res = await client.query('SELECT NOW() as message');
    expect(res.rows[0].message.length).toBeGreaterThan(0);

    await client.end();
  });

  test('query with params', async () => {
    const client = new DataApiClient(dbUrl);

    await client.connect();
    const res = await client.query('select * from information_schema.tables where table_name = :name ', { name: 'pg_tables' });

    expect(res.rows[0].table_name).toEqual('pg_tables');

    await client.end();
  });

  test('query with array', async () => {
    const client = new DataApiClient(dbUrl);

    await client.connect();
    const res = await client.query("SELECT ARRAY['key', 'value', 'key key', 'value value'] as stringArrayOne");

    expect(res.rows[0].stringarrayone).toEqual(['key', 'value', 'key key', 'value value']);

    await client.end();
  });

  test('get raw connection string', async () => {
    const client = new DataApiClient(dbUrl);

    const rawConfig = await client.dataApiRetrievePostgresNativeClientConfig();
    console.log(rawConfig);

    expect(rawConfig.user.length).toBeGreaterThan(0);
  });
});

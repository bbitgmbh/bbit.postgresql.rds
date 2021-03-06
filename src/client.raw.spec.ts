import { Client as RawClient } from './client';

const dbUrl = process.env.AURORA_TEST_DB_URL;

if (!process.env.CI) {
  console.log(dbUrl);
}

describe('Simulate raw postgres client', () => {
  test('simple string query', async () => {
    const client = new RawClient(dbUrl);

    await client.connect();
    const res = await client.query('SELECT NOW() as message'); // ?
    console.log('message res', res);
    expect(res.rows[0].message.length).toBeGreaterThan(0);

    await client.end();
  });

  test('query with params', async () => {
    const client = new RawClient(dbUrl);

    await client.connect();
    const res = await client.query('select * from information_schema.tables where table_name = :name ', { name: 'pg_tables' });

    expect(res.rows[0].table_name).toEqual('pg_tables');

    await client.end();
  });

  test('query with array', async () => {
    const client = new RawClient(dbUrl);

    await client.connect();
    const res = await client.query("SELECT ARRAY['key', 'value', 'key key', 'value value'] as stringArrayOne");

    // default setting of pg-client seems to be a stringified array
    expect(res.rows[0].stringarrayone).toEqual('["key","value","key key","value value"]');

    await client.end();
  });

  test('query with positional parameters', async () => {
    const client = new RawClient(dbUrl);

    await client.connect();
    const res = await client.query('select * from information_schema.tables where table_name = $1 ', ['pg_tables']);

    expect(res.rows[0].table_name).toEqual('pg_tables');

    await client.end();
  });
});

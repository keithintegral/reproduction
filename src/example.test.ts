import { MikroORM } from '@mikro-orm/sqlite';
import { EntityA, EntityB, FieldB } from './user.entity';
// import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: 'sqlite.db',
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    debug: ['query', 'query-params'],
    allowGlobalContext: true, // only for testing
  });
  await orm.schema.refreshDatabase();
});

afterAll(async () => {
  delete process.env.MIKRO_ORM_DBEUG;
  await orm.close(true);
});

test('basic CRUD example', async () => {
  const entityA = orm.em.create(EntityA, { organization: 'orgId' });
  await orm.em.flush();

  orm.em.create(EntityB, new EntityB('orgId', entityA, '100', 1, 1, new FieldB('anything')));
  await orm.em.flush();
  orm.em.clear();

  const filter ={
    "organization":"orgId",
    "entities_b":{
       "organization":"orgId",
       "$and":[
          {
             "$or":[
                {
                   "amount::numeric":{
                      "$ne":0
                   }
                },
                {
                   "coalesce(fee_amount::numeric, 0)":{
                      "$ne":0
                   }
                }
             ]
          },
          {
             "fieldF":false,
             "fieldE":false
          },
          {
             "$and":[
                {
                   "$or":[
                      {
                         "fieldD":{
                            "$nin":[
                               2,
                               3
                            ]
                         }
                      },
                      {
                         "fieldD":null
                      }
                   ]
                },
                {
                   "$or":[
                      {
                         "fieldC":{
                            "$nin":[
                               2,
                               3
                            ]
                         }
                      },
                      {
                         "fieldC":null
                      }
                   ]
                }
             ]
          },
          {
             "$or":[
                {
                   "fieldB":{
                      "id":{
                         "$nin":[
                            "randomId1"
                         ]
                      }
                   }
                },
                {
                   "fieldB":null
                }
             ]
          },
          {
             "$or":[
                {
                   "fieldA":false
                }
             ]
          }
       ]
    }
  }

  process.env.MIKRO_ORM_DBEUG = 'true'
  
  const results = orm.em.getRepository(EntityA).qb()
    .select('*')
    .where(filter)
    .getResult();
  console.log('results', JSON.stringify(results))

  /*
  select 
    `e0`.* 
  from 
    `entities_a` as `e0` 
    left join `entities_b` as `e1` on `e0`.`id` = `e1`.`entity_a_id` 
  where 
    `e0`.`organization` = 'orgId' 
    and `e1`.`organization` = 'orgId' 
    and (
      `e1`.`amount::numeric` != 0 
      or `e1`.`coalesce(fee_amount::numeric, 0)` != 0
    ) 
    and `e1`.`field_f` = false 
    and `e1`.`field_e` = false 
    and (
      `e1`.`field_d` not in (2, 3) 
      or `e1`.`field_d` is null
    ) 
    and (
      `e1`.`field_c` not in (2, 3) 
      or `e1`.`field_c` is null
    ) 
    and (
      `e0`.`field_b_id` not in ('randomId1') 
      or `e1`.`field_b_id` is null
    ) 
    and `e1`.`field_a` = false
  */
      // Similar question why is `e0`.`field_b_id` not in ('randomId1') 
});

import { Entity, PrimaryKey, Property, ManyToOne, Index, OneToMany, Collection } from '@mikro-orm/core';

@Entity({ tableName: "entities_a" })
export class EntityA {

  @PrimaryKey()
  id!: number;

  @Property()
  organization: string;

  @OneToMany({ entity: () => EntityB, mappedBy: 'entityA' })
  entities_b = new Collection<EntityB>(this);


  constructor(organization: string) {
    this.organization = organization;
  }

}


@Entity()
export class FieldB {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

@Entity({ tableName: "entities_b" })
export class EntityB {

  @PrimaryKey()
  id!: number;

  @Property()
  organization: string;

  @Property()
  amount: string;

  @Property()
  fieldE: boolean;

  @Property()
  fieldF: boolean;
  
  @Property({ nullable: true })
  fieldD: number;

  @Property({ nullable: true })
  fieldC: number;

  @ManyToOne({ entity: () => FieldB, nullable: true})
  fieldB: FieldB;

  @Property()
  fieldA: boolean;

  @ManyToOne({ entity: () => EntityA, nullable: true })
  // @Index()
  entityA?: EntityA;
  

  constructor(organization: string, entityA: EntityA, amount: string, fieldD: number, fieldC: number, fieldB: FieldB) {
    this.organization = organization;
    this.amount = amount;
    this.fieldE = false;
    this.fieldF = false;
    this.fieldD = fieldD;
    this.fieldC = fieldC;
    this.fieldB = fieldB;
    this.fieldA = false;
    this.entityA = entityA;
  }
}

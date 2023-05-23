import { Entity, EntityItem } from 'electrodb'
import { ulid } from 'ulid'
import { Dynamo } from './dynamo'

const EventTypes = ['success', 'failure'] as const
export type EventType = (typeof EventTypes)[number]

export type EventBody = unknown

export type EventData = {
  type: EventType
  body: EventBody
}

export * as Event from './event'

export const EventLog = new Entity(
  {
    model: {
      version: '1',
      entity: 'Event',
      service: 'log'
    },
    attributes: {
      eventID: {
        type: 'string',
        required: true,
        readOnly: true
      },
      eventType: {
        type: EventTypes,
        required: true,
        readOnly: true
      },
      reason: {
        type: 'string',
        required: false,
        readOnly: true
      },
      userID: {
        type: 'string',
        required: false,
        readOnly: true
      },
      cep: {
        type: 'string',
        required: false,
        readOnly: true
      }
    },
    indexes: {
      primary: {
        pk: {
          field: 'pk',
          composite: ['eventID']
        },
        sk: {
          field: 'sk',
          composite: []
        }
      },
      byUserID: {
        index: 'gsi1',
        pk: {
          field: 'gsi1pk',
          composite: ['userID']
        },
        sk: {
          field: 'gsi1sk',
          composite: []
        }
      },
      byType: {
        index: 'gsi2',
        pk: {
          field: 'gsi2pk',
          composite: ['eventType']
        },
        sk: {
          field: 'gsi2sk',
          composite: []
        }
      }
    }
  },
  Dynamo.Configuration
)

export type Info = EntityItem<typeof EventLog>

export const fromEventID = async (eventID: string) => {
  const result = await EventLog.get({ eventID }).go()
  return result.data
}

export const fromUserID = async (userID: string) => {
  const result = await EventLog.query.byUserID({ userID }).go()
  return result.data
}

export const fromType = async (eventType: EventType) => {
  const result = await EventLog.query.byType({ eventType }).go()
  return result.data
}

export const createSuccessEvent = async (userID: string, cep: string) => {
  const event = await EventLog.put({
    eventType: 'success',
    userID,
    cep,
    eventID: ulid()
  }).go()

  return event.data
}

export const createFailureEvent = async (reason: string) => {
  const event = await EventLog.put({
    eventType: 'failure',
    reason,
    eventID: ulid()
  }).go()

  return event.data
}

export const EventAggregate = new Entity(
  {
    model: {
      version: '1',
      entity: 'EventAggregate',
      service: 'log'
    },
    attributes: {
      userID: {
        type: 'string',
        required: false,
        readOnly: true
      },
      count: {
        type: 'number',
        required: true,
        readOnly: false
      },
      day: {
        type: 'string',
        required: true,
        readOnly: true
      },
      month: {
        type: 'string',
        required: true,
        readOnly: true
      },
      year: {
        type: 'string',
        required: true,
        readOnly: true
      }
    },
    indexes: {
      primary: {
        pk: {
          field: 'pk',
          composite: ['userID', 'year', 'month', 'day']
        },
        sk: {
          field: 'sk',
          composite: []
        }
      },
      byUserID: {
        index: 'gsi1',
        pk: {
          field: 'gsi1pk',
          composite: ['userID']
        },
        sk: {
          field: 'gsi1sk',
          composite: []
        }
      }
    }
  },
  Dynamo.Configuration
)

export type AggregateInfo = EntityItem<typeof EventAggregate>

export const fromAggregate = async (userID: string) => {
  const result = await EventAggregate.query.byUserID({ userID }).go()
  return result.data
}

export const incrementAggregate = async (userID: string, date: Date) => {
  const day = date.getDate().toString()
  const month = (date.getMonth() + 1).toString()
  const year = date.getFullYear().toString()

  const event = await EventAggregate.update({
    userID,
    day,
    month,
    year
  })
    .add({
      count: 1
    })
    .go()

  return event.data
}

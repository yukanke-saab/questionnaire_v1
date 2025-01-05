import { User } from '@prisma/client'

export interface Choice {
  id: string
  text: string | null
  image_url: string | null
  order: number
  created_at: Date
  updated_at: Date
  surveyId: string
}

export interface AttributeChoice {
  id: string
  text: string
  order: number
  created_at: Date
  updated_at: Date
  attributeSettingId: string
}

export interface AttributeSetting {
  id: string
  type: string
  title: string | null
  created_at: Date
  updated_at: Date
  surveyId: string
  choices: AttributeChoice[]
}

export interface Survey {
  id: string
  title: string
  choice_type: string
  created_at: Date
  updated_at: Date
  userId: string
  user: User
  choices: Choice[]
  attributes: AttributeSetting[]
  responses: Response[]
}

export interface Response {
  id: string
  surveyId: string
  userId: string
  choiceId: string
  created_at: Date
  attributes: RespondentAttribute[]
}

export interface RespondentAttribute {
  id: string
  responseId: string
  attributeSettingId: string
  attributeChoiceId: string
  created_at: Date
}

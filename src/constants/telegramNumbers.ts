export const TelegramNumber = {
  HeartBeat: 1,
  SorterStatus: 10,
  InductionStatus: 11,
  InductionMode: 12,
  ItemInducted: 20,
  ItemDischarged: 21,
  ItemSortedConfirm: 22,
  DestinationRequest: 30,
  SetControlSorter: 100,
  SetControlSorterAck: 101,
  SetControlInduction: 110,
  SetControlInductionAck: 111,
  SetInductionMode: 120,
  SetInductionModeAck: 121,
  SetOverflowConfiguration: 130,
  SetOverflowConfigurationAck: 131,
  SetResetRequest: 140,
  SetResetRequestAck: 141,
} as const;

export type TelegramNumber = (typeof TelegramNumber)[keyof typeof TelegramNumber];

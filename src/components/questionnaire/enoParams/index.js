import { valueOfEndQuestion } from 'utils/questionnaire';
import {
  contextOptions,
  endGenericQuestionsOptions,
  modeOptions,
  paginationOptions,
  questNumOptions,
  seqNumOptions,
} from '../form/enoParamsForm';

export const EnoParams = ({
  mode,
  pagination,
  questNum,
  seqNum,
  context,
  commentQuest,
  timeQuest,
}) => (
  <>
    {context !== 'DEFAULT' && (
      <>
        <b>Contexte : </b>
        {contextOptions.find(({ value }) => value === context)?.label}
        <br />
        <b>Mode : </b>
        {modeOptions.find(({ value }) => value === mode)?.label}
      </>
    )}
    {context === 'DEFAULT' && (
      <>
        <b>Contexte : </b>
        {contextOptions.find(({ value }) => value === context)?.label}
        <br />
        <b>Mode : </b>
        {modeOptions.find(({ value }) => value === mode)?.label}
        <br />
        <b>Pagination : </b>
        {paginationOptions.find(({ value }) => value === pagination)?.label}
        <br />
        <b>Numérotation des questions : </b>
        {questNumOptions.find(({ value }) => value === questNum)?.label}
        <br />
        <b>Numérotation des séquences : </b>
        {seqNumOptions.find(({ value }) => value === seqNum)?.label}
        <br />
        <b>Question de fin : </b>
        {
          endGenericQuestionsOptions.find(
            ({ value }) => value === valueOfEndQuestion({ commentQuest, timeQuest })
          )?.label
        }
        <br />
      </>
    )}
  </>
);

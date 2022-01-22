import React from 'react';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Error from './Form';
import useVisualMode from 'hooks/useVisualMode';
import './styles.scss';
import Confirm from './Confirm';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
    const { mode, transition, back } = useVisualMode(
        props.interview ? SHOW : EMPTY
    );
    
    function save(name, interviewer) {
        const interview = {
          student: name,
          interviewer
        };
        transition(SAVING);
        props.bookInterview(props.id, interview)
            .then(transition(SHOW))
            .catch(error => transition(ERROR_SAVE, true));
    }
    
    function destroy (){
          transition(DELETING, true);
          props.cancelInterview(props.id)
              .then(transition(EMPTY))
              .catch(error => transition(ERROR_DELETE, true));
    
    }

    return ( 
        <article className="appointment">
            <Header time={props.time} />
            {/* {props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer} /> : <Empty />} */}
            {mode === EMPTY && <Empty onAdd={ () => transition(CREATE)} />}

            {mode === SHOW && (
            <Show
                student={props.interview.student}
                    interviewer={props.interview.interviewer}
                    onDelete={() => transition(CONFIRM)}
                    onEdit={() => transition(EDIT)}
            />
            )}

            {mode === CREATE && (
                <Form name={props.name} interviewers={props.interviewers} onCancel={back} onSave={save}/>
            )}
            {mode === SAVING && (<Status message="Saving" />)}
            {mode === DELETING && (<Status message="Deleting" />)}
            {mode === CONFIRM && (<Confirm
                message="Are you sure you would like to delete?"
                onCancel={back}
                onConfirm={destroy}
            />)}
            {mode === EDIT && (
                <Form
                    name={props.interview.student}
                    interviewer={props.interview.interviewer.id}
                    interviewers={props.interviewers}
                    onCancel={() => transition(SHOW)}
                    onSave={save}
                />
            )}
            {mode === ERROR_SAVE && (
                <Error message='Could not save the appointment' onClose={back} />
            )}
            {mode === ERROR_DELETE && (
                <Error message='Could not delete the appointment' onClose={back} />
            )}

        </article>
    )
}
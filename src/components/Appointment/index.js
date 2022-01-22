import React from 'react';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
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
            .then(transition(SHOW));
    }
    
    function deleteApt (){
          transition(DELETING);
          props.cancelInterview(props.id)
              .then(transition(EMPTY));
    
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
                onConfirm={deleteApt}
            />)}
        </article>
    )
}
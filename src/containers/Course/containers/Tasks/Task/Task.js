import React from 'react';
import PropTypes from "prop-types";
import get from 'lodash/get';

import Scrollbars from "react-custom-scrollbars";

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';

import ArrowForward from '@material-ui/icons/ArrowForward';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import withStyles from '@material-ui/core/styles/withStyles';

import * as Enum from '../../../enum';
import {getTaskId} from "../../../getters";

import connect from './Task.connect';
import styles from './Task.styles';

class Task extends React.PureComponent{
    constructor(props) {
        super();

        this.state = {
            answer: props.solution,
            showImage: false,
            showTheme: false,
        }
    }

    showImageClickHandler = () => {
        if (this.state.showImage){
            this.setState({showImage: false});
        } else {
            this.setState({showImage: true});
        }
    }

    showThemeClickHandler = () => {
        if (this.state.showTheme){
            this.setState({showTheme: false});
        } else {
            this.setState({showTheme: true});
        }
    }

    answerChangeHandler = (event) => {
        this.setState({answer: get(event, 'target.value')});
    };

    clearAnswerField = () => {
        this.setState({answer: ''});
    };

    answerButtonClickHandler = () => {
        this.props.actions.completeTask(this.state.answer);
    };

    goToNextTaskClickHandler = () => {
        const {nextRoute} = this.props;

        this.props.actions.setCurrentRouteId(nextRoute.id);
        this.props.actions.getCourseTask(getTaskId(nextRoute));
    };

    renderAnswerField = () => {
        const {classes, isDone, nextRoute} = this.props;
        const {answer} = this.state;
        const splittedAnswer = answer.split(' ');
        const firstWordError = splittedAnswer[0].toLocaleLowerCase() !== 'select'
            && splittedAnswer[0].toLocaleLowerCase() !== 'update'
            && splittedAnswer[0].toLocaleLowerCase() !== 'delete';

        return (
            <Box display={'block'} className={classes.answerFieldContainer}>
                <TextField label={'Запрос'}
                           multiline
                           rowsMax={10}
                           rows={5}
                           variant={'outlined'}
                           fullWidth
                           maxwidth={500}
                           onChange={this.answerChangeHandler}
                           defaultValue={answer}
                />
                <Box display={'flex'}
                     justifyContent={'flex-end'}
                     className={classes.buttonsContainer}
                >
                    <Button onClick={this.clearAnswerField}> Очистить </Button>
                    <Button color={'primary'}
                            variant={'outlined'}
                            className={classes.button}
                            disabled={answer.length === 0 || firstWordError}
                            onClick={this.answerButtonClickHandler}
                    >
                        Выполнить
                    </Button>
                    {nextRoute.id &&
                        <Button color={'primary'}
                                className={classes.nextTaskButton}
                                onClick={this.goToNextTaskClickHandler}
                                endIcon={<ArrowForward/>}
                        >
                            {isDone ? 'Следующее задание' : 'Пропустить задание'}
                        </Button>
                    }
                </Box>
            </Box>
        );
    };

    renderErrorTables = () => {
        const {classes, tableErrorData} = this.props;
        const refResult = get(tableErrorData, [Enum.ERROR_REF_RESULT, 1, 1], []);
        const studentResult = get(tableErrorData, [Enum.ERROR_STUDENT_RESULT, 1, 1], []);

        return (
            <Box className={classes.tableWrap}>
                <Typography> Неверно! </Typography>

                <div className={classes.tableBody}>
                    <div className={classes.table}>
                        <Typography className={classes.tableTitle}> Правильный запрос </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                {refResult.map((row, index) =>
                                    <TableRow key={`right-answer-row-${index}`}>
                                        {row.map((cell, index) =>
                                            <TableCell key={`right-answer-cell-${index}`}>
                                                {cell}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )}
                            </Table>
                        </TableContainer>
                    </div>

                    <div className={classes.table}>
                        <Typography className={classes.tableTitle}> Ваш запрос </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                {studentResult.map((row, index) =>
                                    <TableRow key={`wrong-answer-row-${index}`}>
                                        {row.map((cell, index) =>
                                            <TableCell key={`wrong-answer-cell-${index}`}>
                                                {cell}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )}
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </Box>
        );
    }

    renderAnswerTable = () => {
        const {classes, answer} = this.props;

        return (
            <Box className={classes.tableWrap}>
                <Typography> Правильно! </Typography>

                <div className={classes.tableBody}>
                    <div className={classes.table}>
                        <Typography className={classes.tableTitle}> Результат выполнения запроса</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                {answer.map(row =>
                                    <TableRow>
                                        {row.map(cell =>
                                            <TableCell>
                                                {cell}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )}
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </Box>
        );
    }

    changeTabToMethodical = (id, subMaterialId) => () => {
        this.props.actions.setCurrentCourseTab(1);
        this.props.actions.getCourseMethodicalMaterial(id);
        this.props.actions.setCourseMethodicalSubMaterial(subMaterialId);
    }

    themes = () => {
        const {showTheme} = this.state;
        const {classes, themes} = this.props;

        return (
            <>
                <Button onClick={this.showThemeClickHandler}
                        color={'primary'}
                        endIcon={
                            showTheme ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />
                        }
                        className={classes.showDBButton}
                >
                    Темы для изучения
                </Button>


                <Collapse in={showTheme} collapsedHeight={0}>
                    {themes.map(item => <div key={item.theme.id}>
                            <Typography className={classes.materialItem}>{item.theme.title}</Typography>
                            {item.theme.topic_in_themes.map(topic =>
                                <div key={`topic-${topic.id}`}
                                     className={classes.materialSubItem}
                                     onClick={this.changeTabToMethodical(item.theme.id, topic.id)}>
                                    <Typography>{topic.topic_name}</Typography>
                                </div>
                            )}
                        </div>
                    )}
                </Collapse>
            </>
        )
    }

    databaseStructure = () => {
        const {showImage} = this.state;
        const {classes, task} = this.props;

        const taskDescription = get(task, `database_description`, '');
        const taskImage = get(task, `database_image`, '');

        return (
            <>
                <Button onClick={this.showImageClickHandler}
                        color={'primary'}
                        endIcon={
                            showImage ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />
                        }
                        className={classes.showDBButton}
                >
                    {showImage ? <> Скрыть схему БД </> : <> Посмотреть схему БД </> }
                </Button>

                <Collapse in={showImage} collapsedHeight={0}>
                    <Typography> {taskDescription} </Typography>
                    <div className={classes.image}> <img src={taskImage} alt=""/> </div>
                </Collapse>
            </>
        )
    }

    render() {
        const {task, classes, error, tableErrorData, answer} = this.props;
        const taskText = get(task, `task_text`, null);
        const taskTitle = get(task, `title`, '');
        const refResult = get(tableErrorData, [Enum.ERROR_REF_RESULT, 1, 1], []);
        const studentResult = get(tableErrorData, [Enum.ERROR_STUDENT_RESULT, 1, 1], []);

        if (!taskText) return <></>;

        return (
            <div className={classes.taskRoot}>
                <Scrollbars minheight={300}>
                    <div className={classes.taskInfo}>
                        <Typography> <b>{taskTitle}:</b> </Typography>
                        <Typography> {taskText} </Typography>

                        {this.databaseStructure()}
                        {this.themes()}

                    </div>

                    {this.renderAnswerField()}

                    {error &&
                        <Paper className={classes.simpleErrorBlock}>
                            <Typography className={classes.simpleErrorText}> {error} </Typography>
                        </Paper>
                    }

                    {refResult.length > 0 && studentResult.length > 0 && this.renderErrorTables()}

                    {answer.length > 0 && this.renderAnswerTable()}
                </Scrollbars>
            </div>
        )
    }
}

Task.propTypes = {
    changeTabToMethodical: PropTypes.func,
    error: PropTypes.any,
    isDone: PropTypes.bool,
    task: PropTypes.object,
    actions: PropTypes.object,
    tableErrorData: PropTypes.object,
    currentTask: PropTypes.string,
    nextRoute: PropTypes.object,
};

export default withStyles(styles)(connect(Task));
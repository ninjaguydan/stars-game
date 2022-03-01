import React from 'react'
import { useEffect, useState } from 'react';
import StarDisplay from './StarDisplay'
import NumberBtn from './NumberBtn';
import NewGame from './NewGame';
import utils from '../math-utils'

//Custom Hook
const useGameState = () => {
	const [stars, setStars] = useState(utils.random(1,9))
	const [availableNums, setAvailableNums] = useState(utils.range(1,9))
	const [candidateNums, setCandidateNums] = useState([])
	const [secondsLeft, setSecondsLeft] = useState([10])

	useEffect(() => {
		if (secondsLeft > 0 && availableNums.length > 0) {
			const timerId = setTimeout(() => {
				setSecondsLeft(secondsLeft-1)
			}, 1000)
			return () => clearTimeout(timerId)
		}
	})
	const setGameState = (newCandidateNums) => {
		if (utils.sum(newCandidateNums) !== stars) {
			setCandidateNums(newCandidateNums)
			
		} else {
			const newAvailableNums = availableNums.filter(
				n => !newCandidateNums.includes(n)
			)
			setStars(utils.randomSumIn(newAvailableNums, 9))
			setAvailableNums(newAvailableNums)
			setCandidateNums([])
		}
	}
	return { stars, availableNums, candidateNums, secondsLeft, setGameState }
}

// STAR MATCH
const Game = props => {
	const {
		stars,
		availableNums,
		candidateNums, 
		secondsLeft,
		setGameState
	} = useGameState()

	const candidatesAreWrong = utils.sum(candidateNums) > stars
	const gameStatus = availableNums.length === 0
		? 'won'
		: secondsLeft === 0 ? 'lost' : 'active'

	const numberStatus = number => {
		if (!availableNums.includes(number)) {
			return 'used'
		}
		if (candidateNums.includes(number)) {
			return candidatesAreWrong ? 'wrong' : 'candidate'
		}
		return 'available'
	}

	const onNumberClick = (number, curStatus) => {
		if (gameStatus !== 'active' || curStatus === 'used') {
			return
		}
		

		const newCandidateNums = 
			curStatus ==='available'
			? candidateNums.concat(number)
			: candidateNums.filter(cn => cn !== number)

		setGameState(newCandidateNums)
	}

	return (
		<div className="game">
			<div className="help">
				Pick 1 or more numbers that sum to the number of stars
			</div>
			<div className="body">
				<div className="left">
					{ gameStatus !== 'active' ? (
						<NewGame onClick={props.startNewGame} gameStatus={gameStatus} />
					) : (
						<StarDisplay count={stars} />
					) }
					
				</div>
				<div className="right">
					{utils.range(1,9).map(num => 
						<NumberBtn 
							key={num}
							status={numberStatus(num)}
							number={num}
							onClick={onNumberClick}
						/>
					)}
				</div>
			</div>
			<div className="timer">Time Remaining: {secondsLeft}</div>
		</div>
	)
}

export default Game
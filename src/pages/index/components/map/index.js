import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchParsedSkills, getParsedSkills } from 'store/reducers/parsed-skills'
import {
  fetchSpecializationsForSkills,
  getSpecializationsForSkills,
  fetchSpecializations,
  getSpecializations,
} from 'store/reducers/specializations'

import styles from './styles.module.scss'

const query = '?orderby=count&order=desc';

const SIZES = {
  marginTop: 25,
  marginLeft: 25,
  cardWidth: 90,
  cardHeight: 100,
}

export default function Map () {
  const dispatch = useDispatch()
  const parsedSkills = useSelector(getParsedSkills)
  const specializationsForSkills = useSelector(getSpecializationsForSkills)
  const specializations = useSelector(getSpecializations)

  const [width, setWidth] = useState(1920)
  const [height, setHeight] = useState(1005) // 1080 - 75 (header)
  const [graph, setGraph] = useState([])
  const [lines, setLines] = useState([])
  const [markupLines, setMarkupLines] = useState([])

  useEffect(() => {
    dispatch(fetchParsedSkills(query))
    dispatch(fetchSpecializationsForSkills())
    dispatch(fetchSpecializations())

    const timer = setInterval(() => {
      dispatch(fetchParsedSkills(query))
      dispatch(fetchSpecializationsForSkills())
    }, 10000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (specializations.length === 0 || parsedSkills.length === 0 || specializationsForSkills.length === 0) {
      return;
    }

    const tempMap = specializations.reduce((map, specialization) => Object.assign(map, { [specialization.id]: [] }), {})

    const newGraphData = parsedSkills.reduce((total, skill) => { // iterate through parsed skills sorted by count
      let yIndentSum = 0;
      for (let i = 0; i < specializations.length; i++) { // iterate through each row
        const specId = specializations[i].id;
        // check if skill suppose to be in row
        if (specializationsForSkills[skill.id].specializations.find(spec => spec.id === specId)) {
          tempMap[specId].push(skill.id)
          // yIndentSum += i * (SIZES.cardHeight + 2 * SIZES.marginTop) + SIZES.marginTop; // |*[] - indent + size
          yIndentSum += i * SIZES.cardHeight + (2 * i + 1) * SIZES.marginTop
        } else {
          tempMap[specId].push(null)
        }
      }

      const longestCurrentSpecLength = Object.keys(tempMap)
        .reduce((length, specId) => tempMap[specId].length > length ? tempMap[specId].length : length, 0)
      // find longest row

      // total[skill.id] = {
      //   x: (longestCurrentSpecLength - 1) * (SIZES.cardWidth + 2 * SIZES.marginLeft) + SIZES.marginLeft, // |*[] - indent + size
      //   y: yIndentSum / specializationsForSkills[skill.id].specializations.length, // centralize between specs (rows)
      //   skill,
      // }
      // return total;

      const columnsCount = longestCurrentSpecLength - 1;
      const x = columnsCount * SIZES.cardWidth + (2 * columnsCount + 1) * SIZES.marginLeft; // |*[] - indent + size
      const y = yIndentSum / specializationsForSkills[skill.id].specializations.length; // centralize between specs (rows)

      total[skill.id] = {
        x: x, // |*[] - indent + size
        y: y, // centralize between specs (rows)
        skill,
      }
      return total
    }, [])

    const newGraph = Object.values(newGraphData).map((data, i) => (
      <g
        key={i}
        transform={`translate(${data.x}, ${data.y})`}
      >
        <rect
          height={SIZES.cardHeight}
          width={SIZES.cardWidth}
        />
        <text
          transform={`translate(${SIZES.cardWidth / 2}, ${SIZES.cardHeight / 2 + 6})`}
        >{data.skill.title}</text>
      </g>
    ))

    const longestCurrentSpecLength = Object.keys(tempMap)
      .reduce((length, specId) => tempMap[specId].length > length ? tempMap[specId].length : length, 0)

    const rowsCount = Object.keys(tempMap).length;
    const newHeight = rowsCount * (SIZES.cardHeight + 2 * SIZES.marginTop);
    const newWidth = longestCurrentSpecLength * (SIZES.cardWidth + 2 * SIZES.marginLeft);

    const newMarkupLines = [...new Array(rowsCount + 1)]
      .map((_, i) => {
        const y = i * (SIZES.cardHeight + 2 * SIZES.marginTop);
        return (
          <line
            key={i}
            x1="0"
            y1={y}
            x2={newWidth}
            y2={y}
          />
        )
      })

    const newLines = Object.keys(tempMap).reduce((total, specId) => {
      let prevNotNullSkillId

      for (let i = 0; i < tempMap[specId].length; i++) {
        if (tempMap[specId][i]) {
          if (prevNotNullSkillId) {
            const skillLeft = newGraphData[prevNotNullSkillId]
            const skillRight = newGraphData[tempMap[specId][i]]

            total.push(
              <line
                key={`${specId}-${i}`}
                x1={skillLeft.x + SIZES.cardWidth}
                y1={skillLeft.y + SIZES.cardHeight / 2}
                x2={skillRight.x}
                y2={skillRight.y + SIZES.cardHeight / 2}
                markerEnd="url(#arrowhead)"
              />,
            )
          }

          prevNotNullSkillId = tempMap[specId][i]
        }
      }
      return total
    }, [])

    setHeight(newHeight)
    setWidth(newWidth)

    setMarkupLines(newMarkupLines)
    setLines(newLines)
    setGraph(newGraph)
  }, [parsedSkills, specializationsForSkills, specializations])

  return (
    <div className={styles.map}>
      <svg width={width} height={height}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7"
                  refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff" />
          </marker>
        </defs>
        <g className={styles.markUp}>
          {markupLines}
        </g>
        <g className={styles.nodes}>
          {graph}
        </g>
        <g className={styles.lines}>
          {lines}
        </g>
      </svg>
    </div>
  )
}

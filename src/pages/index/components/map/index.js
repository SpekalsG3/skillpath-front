import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchParsedSkills, getParsedSkills } from 'store/reducers/parsed-skills';
import {
  fetchSpecializationsForSkills,
  getSpecializationsForSkills,
  fetchSpecializations,
  getSpecializations,
} from 'store/reducers/specializations';
import { getLocalPreferences, getPreferences } from 'store/reducers/users';

import styles from './styles.module.scss';
import cn from 'classnames';

const query = '?orderby=count&order=desc';

const SIZES = {
  marginTop: 25,
  marginLeft: 25,
  cardWidth: 90,
  cardHeight: 100,
  tipRatio: 0.14,
};

export default function Map ({ onSkillSelect }) {
  const dispatch = useDispatch();
  const parsedSkills = useSelector(getParsedSkills);
  const specializationsForSkills = useSelector(getSpecializationsForSkills);
  const specializations = useSelector(getSpecializations);
  const userPreferences = useSelector(getPreferences);
  const localPreferences = useSelector(getLocalPreferences);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0); // 1080 - 75 (header)
  const [graph, setGraph] = useState([]);
  const [lines, setLines] = useState([]);
  const [markupLines, setMarkupLines] = useState([]);

  const handleOpenSkill = (skill) => () => {
    onSkillSelect(skill);
  };

  useEffect(() => {
    dispatch(fetchParsedSkills(query));
    dispatch(fetchSpecializationsForSkills());
    dispatch(fetchSpecializations());
  }, []);

  const createLine = (skillLeft, skillRight, isDisabled = false) => (
    <line
      className={isDisabled ? styles.lineDisabled : ''}
      key={`${skillLeft.skill.id}-${skillRight.skill.id}`}
      x1={skillLeft.x + SIZES.cardWidth}
      y1={skillLeft.y + SIZES.cardHeight / 2}
      x2={skillRight.x}
      y2={skillRight.y + SIZES.cardHeight / 2}
      markerEnd={`url(#arrowhead${isDisabled ? '-disabled' : ''})`}
    />
  );

  useEffect(() => {
    if (specializations.length === 0 || parsedSkills.length === 0 || specializationsForSkills.length === 0) {
      return;
    }

    const tempMap = specializations.reduce((map, specialization) => Object.assign(map, { [specialization.id]: [] }), {});

    const newGraphData = parsedSkills.reduce((total, skill) => { // iterate through parsed skills sorted by count
      let yIndentSum = 0;
      for (let i = 0; i < specializations.length; i++) { // iterate through each row
        const specId = specializations[i].id;
        // check if skill suppose to be in row
        if (specializationsForSkills[skill.id].specializations.find(spec => spec.id === specId)) {
          tempMap[specId].push(skill.id);
          yIndentSum += i * SIZES.cardHeight + (2 * i + 1) * SIZES.marginTop;
        } else {
          tempMap[specId].push(null);
        }
      }

      const longestCurrentSpecLength = Object.keys(tempMap)
        .reduce((length, specId) => tempMap[specId].length > length ? tempMap[specId].length : length, 0);
      // find longest row

      const columnsCount = longestCurrentSpecLength - 1;
      const x = columnsCount * SIZES.cardWidth + (2 * columnsCount + 1) * SIZES.marginLeft; // |*[] - indent + size
      const y = yIndentSum / specializationsForSkills[skill.id].specializations.length; // centralize between specs (rows)

      total[skill.id] = {
        x: x, // |*[] - indent + size
        y: y, // centralize between specs (rows)
        skill,
      };
      return total;
    }, []);

    const graphDataKeys = Object.values(newGraphData);
    const newGraph = graphDataKeys.map((data, i) => {
      return (
        <g
          key={i}
          transform={`translate(${data.x}, ${data.y})`}
          onClick={handleOpenSkill(data.skill)}
        >
          <rect
            className={styles.skill}
            height={SIZES.cardHeight}
            width={SIZES.cardWidth}
          />
          <rect
            className={cn({
              [styles.skillWithUserPreference]: userPreferences.hasOwnProperty(data.skill.id),
            })}
            style={{
              display: 'none',
              transform: 'translateY(3px) translateX(3px)',
            }}
            rx={4}
            ry={4}
            height={SIZES.cardHeight * SIZES.tipRatio}
            width={SIZES.cardWidth * SIZES.tipRatio}
          />
          <rect
            className={cn({
              [styles.skillWithLocalPreference]: localPreferences.hasOwnProperty(data.skill.id),
            })}
            style={{
              display: 'none',
              transform: `translateY(3px) translateX(${SIZES.cardHeight * SIZES.tipRatio + 6}px)`,
            }}
            rx={4}
            ry={4}
            height={SIZES.cardHeight * SIZES.tipRatio}
            width={SIZES.cardWidth * SIZES.tipRatio}
          />
          <text
            transform={`translate(${SIZES.cardWidth / 2}, ${SIZES.cardHeight / 2 + 6})`}
          >{data.skill.title}</text>
        </g>
      );
    });

    const longestCurrentSpecLength = Object.keys(tempMap)
      .reduce((length, specId) => tempMap[specId].length > length ? tempMap[specId].length : length, 0);

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
        );
      });

    const finalLines = {};

    const newLines = Object.keys(tempMap).reduce((total, specId) => {
      let prevNotNullSkillId;

      for (let i = 0; i < tempMap[specId].length; i++) {
        if (tempMap[specId][i]) {
          if (prevNotNullSkillId) {
            const skillLeft = newGraphData[prevNotNullSkillId];
            const skillRight = newGraphData[tempMap[specId][i]];

            const linkIndex = total.length;

            if (finalLines[skillLeft.skill.id]?.hasOwnProperty(skillRight.skill.id)) {
              prevNotNullSkillId = tempMap[specId][i];
              continue;
            }

            if (finalLines[skillLeft.skill.id]) {
              finalLines[skillLeft.skill.id][skillRight.skill.id] = linkIndex;
            } else {
              finalLines[skillLeft.skill.id] = {
                [skillRight.skill.id]: linkIndex,
              };
            }

            total.push(createLine(skillLeft, skillRight));
          }

          prevNotNullSkillId = tempMap[specId][i];
        }
      }
      return total;
    }, []);

    if (localPreferences) {
      const metSkills = [];

      Object.keys(localPreferences).forEach(rawSkillId => {
        const skillId = Number(rawSkillId);
        metSkills.push(rawSkillId);

        let currentSkillId = -1;
        let i = -1;
        for (const spec of Object.values(tempMap)) {
          let columnIndex = spec.indexOf(skillId);
          if (columnIndex > -1) {
            currentSkillId = spec[columnIndex];
            i = columnIndex - 1;
            break;
          }
        }

        for (i; i >= 0; i--) {
          for (const skillsInSpec of Object.values(tempMap)) {
            const rawLeftSkillId = skillsInSpec[i];
            if (rawLeftSkillId !== null) {
              const leftSkillId = String(rawLeftSkillId);
              const leftSkillLines = finalLines[leftSkillId];

              Object.keys(leftSkillLines).forEach(rightSkillId => {
                if (metSkills.includes(rightSkillId)) {
                  metSkills.push(leftSkillId);
                  newLines.splice(leftSkillLines[rightSkillId], 1, createLine(
                    newGraphData[leftSkillId],
                    newGraphData[rightSkillId],
                  ));
                } else {
                  newLines.splice(leftSkillLines[rightSkillId], 1, createLine(
                    newGraphData[leftSkillId],
                    newGraphData[rightSkillId],
                    true,
                  ));
                }
              });

              break;
            }
          }
        }
      });
    }

    if (userPreferences) {
      const metSkills = {};

      Object.keys(userPreferences).forEach(rawSkillId => {
        const skillId = Number(rawSkillId);

        let leftSkillId = -1;
        let i = longestCurrentSpecLength;
        for (const spec of Object.values(tempMap)) {
          let columnIndex = spec.indexOf(skillId);
          if (columnIndex > -1) {
            leftSkillId = spec[columnIndex];
            i = columnIndex + 1;
            break;
          }
        }

        if (!finalLines.hasOwnProperty(leftSkillId)) {
          return;
        }

        metSkills[leftSkillId] = Object.keys(finalLines[leftSkillId]);
        for (i; i < longestCurrentSpecLength; i++) {
          for (const skillsInSpec of Object.values(tempMap)) {
            const rawCurrentSkillId = skillsInSpec[i];
            if (rawCurrentSkillId !== null) {
              const currentSkillId = String(rawCurrentSkillId);

              Object.keys(metSkills).forEach(leftSkillId => {
                if (metSkills[leftSkillId].includes(currentSkillId)) {
                  if (finalLines[currentSkillId]) {
                    metSkills[currentSkillId] = Object.keys(finalLines[currentSkillId]);
                  }

                  newLines.splice(finalLines[leftSkillId][currentSkillId], 1, createLine(
                    newGraphData[leftSkillId],
                    newGraphData[currentSkillId],
                  ));
                } else {
                  if (finalLines[currentSkillId]) {
                    Object.keys(finalLines[currentSkillId]).forEach(rightSkillId => {
                      newLines.splice(finalLines[currentSkillId][rightSkillId], 1, createLine(
                        newGraphData[currentSkillId],
                        newGraphData[rightSkillId],
                        true,
                      ));
                    });
                  }
                }
              });

              break;
            }
          }
        }
      });
    }

    setHeight(newHeight);
    setWidth(newWidth);

    setMarkupLines(newMarkupLines);
    setLines(newLines);
    setGraph(newGraph);
  }, [onSkillSelect, parsedSkills, specializationsForSkills, specializations, userPreferences, localPreferences]);

  return (
    <div className={styles.map}>
      <svg width={width} height={height}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7"
                  refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff" />
          </marker>
          <marker id="arrowhead-disabled" markerWidth="10" markerHeight="7"
                  refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#5c5c5c" />
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
  );
}

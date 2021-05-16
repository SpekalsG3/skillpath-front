import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchParsedSkills,
  getParsedSkills,
  fetchAssociationsSkills,
  getAssociationsForSkills,
} from 'store/reducers/parsed-skills';
import {
  fetchSpecializationsForSkills,
  getSpecializationsForSkills,
  fetchSpecializations,
  getSpecializations,
} from 'store/reducers/specializations';

import styles from './styles.module.scss';

const query = '?orderby=count&order=desc';

const SIZES = {
  marginTop: 25,
  marginLeft: 25,
  cardWidth: 90,
  cardHeight: 100,
};

export default function Map () {
  const dispatch = useDispatch();
  const parsedSkills = useSelector(getParsedSkills);
  const specializationsForSkills = useSelector(getSpecializationsForSkills);
  const specializations = useSelector(getSpecializations);
  const associationsForSkills = useSelector(getAssociationsForSkills);

  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1005); // 1080 - 75 (header)
  const [graph, setGraph] = useState([]);
  const [lines, setLines] = useState([]);
  const [markupLines, setMarkupLines] = useState([]);
  const [linksMap, setLinksMap] = useState({});

  useEffect(() => {
    const newLinks = parsedSkills.reduce((newLinksData, skill) => {
      if (newLinksData[skill.id]) {
        // remove duplicate links
        newLinksData[skill.id].children = associationsForSkills[skill.id]
          ? Object.keys(associationsForSkills[skill.id]).reduce((newAssociations, skillId) => {
            if (!newLinksData[skillId]?.children[skill.id]) {
              newAssociations[skillId] = associationsForSkills[skill.id][skillId];
            }
            return newAssociations;
          }, {})
          : {};

        while (newLinksData[skill.id].parents.length > 1) {
          const firstParentLink = newLinksData[skill.id].parents[0];
          const secondParentLink = newLinksData[skill.id].parents[1];

          if (firstParentLink.count < secondParentLink.count) {
            delete newLinksData[firstParentLink.id].children[skill.id];
            newLinksData[skill.id].parents.splice(0, 1);
          } else {
            delete newLinksData[secondParentLink.id].children[skill.id];
            newLinksData[skill.id].parents.splice(1, 1);
          }
        }
      } else {
        newLinksData[skill.id] = {
          children: associationsForSkills[skill.id] || {},
          parents: [],
        };
      }

      Object.keys(newLinksData[skill.id].children).forEach((skillId) => {
        const link = newLinksData[skill.id].children[skillId];

        if (newLinksData[link.skillId]) {
          newLinksData[link.skillId].parents.push({
            id: skill.id,
            count: link.count,
          });
        } else {
          newLinksData[link.skillId] = {
            children: {},
            parents: [{
              id: skill.id,
              count: link.count,
            }],
          };
        }
      });

      return newLinksData;
    }, {});

    setLinksMap(newLinks);
  }, [parsedSkills, associationsForSkills]);

  useEffect(() => {
    dispatch(fetchParsedSkills(query));
    dispatch(fetchSpecializationsForSkills());
    dispatch(fetchSpecializations());
    dispatch(fetchAssociationsSkills());
  }, []);

  useEffect(() => {
    // return;
    if (Object.keys(linksMap).length === 0 || specializations.length === 0 || specializationsForSkills.length === 0) {
      return;
    }

    const tempMap = specializations.reduce((map, specialization) => Object.assign(map, { [specialization.id]: [] }), {});

    const newGraphData = parsedSkills.reduce((total, skill) => { // iterate through parsed skills sorted by count
      let yIndentSum = 0;
      for (let i = 0; i < specializations.length; i++) { // iterate through each row
        const specId = specializations[i].id;
        // check if skill belongs to a spec (row)
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
      const x = columnsCount * SIZES.cardWidth + (2 * columnsCount + 1) * SIZES.marginLeft; // |*[] calculate x = indent + size
      const y = yIndentSum / specializationsForSkills[skill.id].specializations.length; // centralize between specs (rows)

      total[skill.id] = {
        x: x, // |*[] calculate x = indent + size
        y: y, // centralize between specs (rows)
        skill,
      };
      return total;
    }, {});

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
    ));

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

    const newLines = Object.keys(linksMap).reduce((total, skillId) => {
      const skillLeft = newGraphData[skillId];
      for (const child of Object.values(linksMap[skillId].children)) {
        const skillRight = newGraphData[child.skillId];

        total.push(
          <line
            key={`${skillId}-${child.skillId}`}
            x1={skillLeft.x + SIZES.cardWidth}
            y1={skillLeft.y + SIZES.cardHeight / 2}
            x2={skillRight.x}
            y2={skillRight.y + SIZES.cardHeight / 2}
            markerEnd="url(#arrowhead)"
          />,
        );
      }

      return total;
    }, []);

    setHeight(newHeight);
    setWidth(newWidth);

    setMarkupLines(newMarkupLines);
    setLines(newLines);
    setGraph(newGraph);
  }, [linksMap, parsedSkills, specializationsForSkills, specializations]);

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
  );
}

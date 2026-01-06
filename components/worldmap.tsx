"use client";

import { useMemo } from "react";

// Location labels with positions (percentages) and colors
const LOCATION_LABELS = [
  { name: 'USA', top: '30%', left: '22%', color: '#169216' },
  { name: 'UK', top: '18%', left: '47%', color: '#C9567D' },
  { name: 'Cyprus', top: '35%', left: '57%', color: '#24c7c0' },
  { name: 'Dubai', top: '40%', left: '68%', color: '#6593d6' },
  { name: 'Singapore', top: '56%', left: '82%', color: '#1fbeca' },
];

const continents: Record<string, number[]> = {
  northAmerica: [
    19, 20, 21, 73, 74, 75, 76, 77, 123, 124, 127, 128, 129, 130, 131, 132, 177,
    178, 179, 181, 182, 183, 184, 185, 186, 187, 188, 228, 229, 230, 231, 232,
    233, 234, 237, 238, 239, 240, 241, 242, 243, 283, 284, 285, 286, 287, 288,
    289, 293, 294, 295, 296, 297, 332, 333, 334, 337, 339, 340, 341, 342, 343,
    348, 349, 350, 351, 352, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396,
    397, 398, 399, 404, 405, 406, 407, 441, 442, 443, 444, 445, 446, 447, 448,
    449, 450, 451, 452, 453, 454, 455, 459, 460, 497, 498, 499, 500, 501, 502,
    503, 504, 505, 506, 507, 509, 510, 511, 514, 552, 553, 554, 555, 556, 557,
    558, 559, 560, 561, 562, 564, 565, 566, 607, 610, 611, 612, 613, 614, 615,
    616, 619, 620, 621, 622, 666, 667, 668, 669, 670, 671, 672, 674, 675, 676,
    722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 778, 779, 780, 781, 782,
    783, 784, 785, 786, 834, 835, 836, 837, 838, 839, 889, 890, 891, 892, 893,
    894, 944, 945, 946, 947, 948, 949, 1000, 1001, 1002, 1005, 1056, 1057, 1112,
    1113, 1114, 1169,
  ],
  southAmerica: [
    1225, 1226, 1227, 1228, 1229, 1281, 1282, 1283, 1284, 1285, 1335, 1336,
    1337, 1338, 1339, 1340, 1341, 1342, 1390, 1391, 1392, 1393, 1394, 1395,
    1396, 1397, 1446, 1447, 1448, 1449, 1450, 1451, 1502, 1503, 1504, 1505,
    1506, 1557, 1558, 1559, 1560, 1612, 1613, 1614, 1666, 1667, 1668, 1721,
    1722, 1776, 1777, 1831, 1832, 1887,
  ],
  europe: [
    361, 362, 415, 416, 417, 469, 470, 471, 472, 523, 524, 525, 527, 582, 580,
    579, 578, 632, 634, 636, 631, 311, 312, 251, 519, 520, 686, 687, 689, 688,
    690, 691, 692, 637, 638, 583, 528, 473, 418, 474, 475, 365, 421, 476, 477,
    531, 530, 529, 584, 585, 586, 639, 640, 641, 693, 694, 695, 696, 795, 796,
    850, 851, 797, 742, 743, 744, 745, 746, 747, 748, 749, 750, 751, 805, 804,
    803, 802, 801, 799, 798, 800, 854, 856, 857, 911,
  ],
  africa: [
    961, 962, 963, 965, 1020, 1021, 1019, 1018, 1017, 1016, 1015, 1069, 1070,
    1071, 1072, 1073, 1074, 1075, 1076, 1077, 1124, 1125, 1126, 1127, 1128,
    1129, 1130, 1131, 1132, 1133, 1179, 1180, 1181, 1182, 1183, 1184, 1185,
    1186, 1187, 1188, 1189, 1235, 1236, 1237, 1238, 1239, 1240, 1241, 1242,
    1243, 1244, 1293, 1294, 1295, 1296, 1297, 1298, 1348, 1349, 1350, 1351,
    1352, 1404, 1405, 1406, 1407, 1459, 1460, 1461, 1462, 1514, 1515, 1516,
    1518, 1573, 1569, 1570, 1571, 1624, 1625,
  ],
  asia: [
    154, 208, 209, 210, 262, 263, 264, 265, 314, 315, 316, 317, 318, 319, 320,
    321, 322, 323, 325, 326, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378,
    379, 380, 381, 382, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433,
    434, 435, 436, 437, 438, 439, 440, 478, 479, 480, 481, 482, 483, 484, 485,
    486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 532, 533, 534, 535, 536,
    537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 587,
    588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 603,
    642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 657, 658,
    697, 698, 699, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 712, 752,
    753, 754, 755, 756, 757, 758, 759, 760, 761, 762, 763, 764, 807, 808, 809,
    810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 821, 859, 860, 861, 862,
    863, 864, 865, 866, 867, 868, 869, 870, 871, 872, 873, 876, 913, 914, 916,
    917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 928, 930, 967, 968, 969,
    970, 972, 973, 974, 975, 976, 977, 978, 979, 980, 981, 982, 1022, 1023,
    1024, 1025, 1026, 1027, 1029, 1030, 1031, 1034, 1035, 1036, 1037, 1079,
    1080, 1081, 1085, 1089, 1090, 1135, 1144, 1145, 1200, 1202, 1203, 1255,
    1256, 1257, 1311,
  ],
  australia: [
    1206, 1262, 1263, 1317, 1369, 1370, 1372, 1422, 1423, 1424, 1425, 1426,
    1427, 1428, 1476, 1477, 1478, 1479, 1480, 1481, 1482, 1483, 1531, 1532,
    1533, 1534, 1535, 1536, 1537, 1538, 1586, 1587, 1590, 1591, 1592, 1645,
    1646, 1650, 1705,
  ],
};

// Pre-compute which continent each cell belongs to
const cellContinentMap = new Map<number, string>();
Object.entries(continents).forEach(([continent, cells]) => {
  cells.forEach((cell) => cellContinentMap.set(cell, continent));
});

// Seeded random for consistent animation delays
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

const animationDurations: Record<string, number> = {
  northAmerica: 8,
  southAmerica: 6,
  europe: 6,
  africa: 8,
  asia: 10,
  australia: 4,
};

export default function WorldMap() {
  const cells = useMemo(() => {
    const totalCells = 35 * 55;
    return Array.from({ length: totalCells }, (_, i) => {
      const cellIndex = i + 1;
      const continent = cellContinentMap.get(cellIndex);

      if (!continent) {
        return { index: cellIndex, continent: null, delay: 0, duration: 0 };
      }

      const duration = animationDurations[continent];
      const delay = -seededRandom(cellIndex) * duration;

      return { index: cellIndex, continent, delay, duration };
    });
  }, []);

  return (
    <div className="world-map-wrapper">
      <style jsx global>{`
        @keyframes dot-pulse {
          0% {
            background-color: #ffffff;
          }
          100% {
            background-color: #333333;
          }
        }
      `}</style>
      <style jsx>{`
        .world-map-wrapper {
          position: relative;
          display: inline-block;
        }

        .world-map-grid {
          display: inline-grid;
          grid-template-columns: repeat(55, 1fr);
          grid-template-rows: repeat(35, 1fr);
          gap: 0;
          background: transparent;
        }

        .cell {
          width: 6px;
          height: 6px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #333;
        }

        .location-label {
          position: absolute;
          padding: 2px 5px;
          font-family: 'Montserrat', sans-serif;
          font-size: 6px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          color: white;
          border-radius: 2px;
          white-space: nowrap;
          transform: translate(-50%, -100%);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
          z-index: 10;
        }

        .location-label::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 3px solid transparent;
          border-right: 3px solid transparent;
          border-top: 3px solid currentColor;
        }

        .location-dot {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 11;
          animation: dot-blink 2s ease-in-out infinite;
        }

        @keyframes dot-blink {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 0 0 currentColor;
          }
          50% {
            opacity: 0.8;
            box-shadow: 0 0 0 3px currentColor;
          }
        }
      `}</style>

      {/* Location Labels */}
      {LOCATION_LABELS.map((location, index) => (
        <div key={location.name}>
          {/* Label */}
          <div
            className="location-label"
            style={{
              top: location.top,
              left: location.left,
              backgroundColor: location.color,
              color: location.color,
            }}
          >
            <span style={{ color: 'white' }}>{location.name}</span>
          </div>
          {/* Dot marker */}
          <div
            className="location-dot"
            style={{
              top: location.top,
              left: location.left,
              backgroundColor: location.color,
              color: `${location.color}40`,
              animationDelay: `${index * 0.4}s`,
            }}
          />
        </div>
      ))}

      {/* Map Grid */}
      <div className="world-map-grid">
        {cells.map(({ index, continent, delay, duration }) => {
          if (!continent) {
            return <div key={index} className="cell" />;
          }

          return (
            <div
              key={index}
              className="cell dot"
              style={{
                animation: `dot-pulse ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

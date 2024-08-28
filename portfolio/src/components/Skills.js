import React from 'react';
import { motion } from 'framer-motion';
import {
  SiC, SiCplusplus, SiCsharp, SiPython, SiJavascript, SiPhp, SiHtml5, SiCss3, SiPowershell, SiOracle,
  SiMysql, SiFlask, SiJira, SiBitbucket, SiGit, SiLinux, SiVisualstudio, SiIntellijidea, SiPandas, SiNumpy,
  SiWindows, SiVmware, SiMicrosoftexcel, SiApachespark, SiMicrosoftazure, SiAnsible, SiUbuntu, SiActivecampaign
} from 'react-icons/si';
import { FaDatabase, FaServer, FaJava, FaTerminal, FaCode } from 'react-icons/fa'; // Added FaCode for Geany
import './Skills.css';

const Skills = () => {
  const skills = [
    // Languages
    { icon: <SiC size={50} color="#A8B9CC" />, name: 'C' },
    { icon: <SiCplusplus size={50} color="#00599C" />, name: 'C++' },
    { icon: <SiCsharp size={50} color="#239120" />, name: 'C#' },
    { icon: <SiPython size={50} color="#3776AB" />, name: 'Python' },
    { icon: <FaJava size={50} color="#007396" />, name: 'Java' }, // Corrected icon for Java
    { icon: <SiJavascript size={50} color="#F7DF1E" />, name: 'JavaScript' },
    { icon: <SiPhp size={50} color="#777BB4" />, name: 'PHP' },
    { icon: <SiHtml5 size={50} color="#E34F26" />, name: 'HTML' },
    { icon: <FaTerminal size={50} color="#4EAA25" />, name: 'BASH' }, // Using FaTerminal to represent BASH
    { icon: <SiCss3 size={50} color="#1572B6" />, name: 'CSS' },
    { icon: <SiPowershell size={50} color="#5391FE" />, name: 'PowerShell' },
    { icon: <SiMysql size={50} color="#4479A1" />, name: 'MySQL' },
    
    // Frameworks & Technologies
    { icon: <SiOracle size={50} color="#F80000" />, name: 'Oracle' },
    { icon: <SiFlask size={50} color="#000000" />, name: 'Flask' },
    { icon: <SiJira size={50} color="#0052CC" />, name: 'Jira' },
    { icon: <SiBitbucket size={50} color="#0052CC" />, name: 'BitBucket' },
    { icon: <SiGit size={50} color="#F05032" />, name: 'Git/GitHub' },
    { icon: <SiLinux size={50} color="#FCC624" />, name: 'Linux' },
    { icon: <SiWindows size={50} color="#0078D6" />, name: 'Windows' },
    { icon: <SiVisualstudio size={50} color="#5C2D91" />, name: 'Visual Studio' },
    { icon: <SiIntellijidea size={50} color="#000000" />, name: 'IntelliJ' },
    { icon: <FaCode size={50} color="#000000" />, name: 'Geany' }, // Using FaCode for Geany
    { icon: <SiPandas size={50} color="#150458" />, name: 'Pandas' },
    { icon: <SiNumpy size={50} color="#013243" />, name: 'Numpy' },
    { icon: <SiVmware size={50} color="#607078" />, name: 'VMware' },
    { icon: <SiActivecampaign size={50} color="#1572B6" />, name: 'Active Directory' },
    { icon: <FaDatabase size={50} color="#336791" />, name: 'Database Systems' },
    { icon: <SiAnsible size={50} color="#EE0000" />, name: 'Machine Learning' },
    { icon: <SiMicrosoftazure size={50} color="#008AD7" />, name: 'Optimization' },
    
    // Additional Skills
    { icon: <SiApachespark size={50} color="#E25A1C" />, name: 'Data Analysis' },
    { icon: <FaServer size={50} color="#5A67D8" />, name: 'Windows Server' },
    { icon: <SiMicrosoftexcel size={50} color="#217346" />, name: 'Data Visualization' },
    { icon: <SiUbuntu size={50} color="#E95420" />, name: 'Unix' },
  ];

  return (
    <section className="skills-section" id="skills">
      <h2>Technical Skills</h2>
      <div className="skills-container">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            className="icon-background"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            {skill.icon}
            <p>{skill.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;

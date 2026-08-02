// Human-curated source of truth for Technical Skills categorization + icons.
// Never shipped to the browser (lives under scripts/, not js/) — only read by
// scripts/import-linkedin-export.js when regenerating js/skillsData.js.
//
// To add a new skill by hand (without waiting for a LinkedIn import), add an
// entry here keyed by its lowercase name, then re-run
// `npm run import:linkedin -- <export-dir>` (or edit js/skillsData.js directly
// for a one-off change).

var CATEGORY_ORDER = [
    'Languages',
    'Frameworks & Libraries',
    'Databases & Data Tools',
    'Systems & DevOps',
    'Dev & Project Tools',
    'Web Services & Integration',
    'Methodologies & Concepts'
];

// Keyed by normalizeSkillName(name) -> { name, category, icon }
var SKILL_CATEGORIES = {
    'c': { name: 'C', category: 'Languages', icon: 'img/icons/c.webp' },
    'c++': { name: 'C++', category: 'Languages', icon: 'img/icons/cpp.webp' },
    'c#': { name: 'C#', category: 'Languages', icon: 'img/icons/c-sharp.png' },
    'python': { name: 'Python', category: 'Languages', icon: 'img/icons/python.png' },
    'java': { name: 'Java', category: 'Languages', icon: 'img/icons/java.png' },
    'javascript': { name: 'JavaScript', category: 'Languages', icon: 'img/icons/javascript.png' },
    'php': { name: 'PHP', category: 'Languages', icon: 'img/icons/php.png' },
    'html': { name: 'HTML', category: 'Languages', icon: 'img/icons/html.png' },
    'css': { name: 'CSS', category: 'Languages', icon: 'img/icons/css.png' },
    'bash': { name: 'BASH', category: 'Languages', icon: 'img/icons/bash.png' },
    'sql': { name: 'SQL', category: 'Languages', icon: 'img/icons/sql.jpg' },
    't-sql': { name: 'T-SQL', category: 'Languages', icon: 'img/icons/t-sql.svg' },
    'powershell': { name: 'PowerShell', category: 'Languages', icon: 'img/icons/powershell.png' },

    '.net': { name: '.NET', category: 'Frameworks & Libraries', icon: 'img/icons/dotnet.svg' },
    'flask': { name: 'Flask', category: 'Frameworks & Libraries', icon: 'img/icons/flask.png' },
    'pandas': { name: 'Pandas', category: 'Frameworks & Libraries', icon: 'img/icons/pandas.png' },
    'numpy': { name: 'Numpy', category: 'Frameworks & Libraries', icon: 'img/icons/numpy.png' },
    'matplotlib': { name: 'Matplotlib', category: 'Frameworks & Libraries', icon: 'img/icons/matplotlib.png' },

    'oracle': { name: 'Oracle', category: 'Databases & Data Tools', icon: 'img/icons/oracle.png' },
    'microsoft sql server': { name: 'Microsoft SQL Server', category: 'Databases & Data Tools', icon: 'img/icons/sql-server.svg' },
    'mysql': { name: 'MySQL', category: 'Databases & Data Tools', icon: 'img/icons/mysql.png' },
    'mysql workbench': { name: 'MySQL Workbench', category: 'Databases & Data Tools', icon: 'img/icons/mysql-workbench.png' },

    'linux': { name: 'Linux', category: 'Systems & DevOps', icon: 'img/icons/linux.png' },
    'unix': { name: 'Unix', category: 'Systems & DevOps', icon: 'img/icons/unix.png' },
    'windows': { name: 'Windows', category: 'Systems & DevOps', icon: 'img/icons/windows.png' },
    'windows server': { name: 'Windows Server', category: 'Systems & DevOps', icon: 'img/icons/windows server.png' },
    'vmware': { name: 'VMWare', category: 'Systems & DevOps', icon: 'img/icons/vmware.png' },
    'active directory': { name: 'Active Directory', category: 'Systems & DevOps', icon: 'img/icons/active directory.jpg' },
    'git/github': { name: 'Git/GitHub', category: 'Systems & DevOps', icon: 'img/icons/git.png' },
    'bitbucket': { name: 'BitBucket', category: 'Systems & DevOps', icon: 'img/icons/bitbucket.png' },
    'api integration': { name: 'API Integration', category: 'Systems & DevOps', icon: 'img/icons/rest-api.png' },

    'jira': { name: 'Jira', category: 'Dev & Project Tools', icon: 'img/icons/jira.png' },
    'visual studio': { name: 'Visual Studio', category: 'Dev & Project Tools', icon: 'img/icons/visual studio.png' },
    'geany': { name: 'Geany', category: 'Dev & Project Tools', icon: 'img/icons/geany.png' },
    'godot': { name: 'Godot', category: 'Dev & Project Tools', icon: 'img/icons/godot.svg' },
    'qgis': { name: 'QGIS', category: 'Dev & Project Tools', icon: 'img/icons/qgis.svg' },

    'wsdl': { name: 'WSDL', category: 'Web Services & Integration', icon: 'img/icons/wsdl.svg' },
    'xml': { name: 'XML', category: 'Web Services & Integration', icon: 'img/icons/xml.svg' },
    'soap': { name: 'SOAP', category: 'Web Services & Integration', icon: 'img/icons/soap.svg' },

    'sdlc': { name: 'SDLC', category: 'Methodologies & Concepts', icon: 'img/icons/sdlc.svg' }
};

// LinkedIn skill label variants -> canonical key in SKILL_CATEGORIES above.
var SKILL_ALIASES = {
    'github': 'git/github',
    'git': 'git/github',
    'ms sql server': 'microsoft sql server',
    'sql server': 'microsoft sql server',
    'mssql': 'microsoft sql server',
    'transact-sql': 't-sql',
    'shell scripting': 'bash',
    'active directory (ad)': 'active directory',
    'vmware esxi': 'vmware',
    'rest apis': 'api integration',
    'rest api': 'api integration',
    'soap protocol': 'soap',
    'soap web services': 'soap',
    'dotnet': '.net',
    '.net framework': '.net',
    '.net core': '.net',
    'godot engine': 'godot',
    'qgis desktop': 'qgis',
    'software development life cycle': 'sdlc',
    'software development lifecycle': 'sdlc'
};

if (typeof module !== 'undefined') {
    module.exports = { CATEGORY_ORDER: CATEGORY_ORDER, SKILL_CATEGORIES: SKILL_CATEGORIES, SKILL_ALIASES: SKILL_ALIASES };
}

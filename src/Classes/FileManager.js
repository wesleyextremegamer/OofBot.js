const fs = require('fs/promises');
const path = require('path');

class FileManager
{
	static async pathExists(Path)
	{
		try {
			await fs.access(Path);
			return true;
		} catch {return false;}
	}
	static async findAll(Path, name) {
		if (!(await FileManager.pathExists(Path))) return;

		let files = [];
		const dir = Path;
		try {
			const rootDir = await fs.readdir(dir);

			for (const filename of rootDir) {
				const filePath = path.join(dir, filename);
				const pathStats = await fs.stat(filePath);

				if (pathStats.isDirectory()) {
					// Recursive Searching inside this another directory
					const seaching = await FileManager.findAll(filePath, name);
					files = [...files, ...seaching];
				}
				else if (filename.includes(name)) {
					files.push(filePath);
				}
			}
			return files;
		} catch (err) {
			console.log('FileManager Error : \n ', err);
		}
	}

	/**
	 @param {string} Path;
	 @param {string} fileFullName ;
	 @param {boolean} stream */
	static async findFirst(Path, FullName)
	{
		if (!(await FileManager.pathExists(Path))) return;

		const fileExtention = FullName.split('.')[1];
		const filesFound = await FileManager.findAll(Path, fileExtention);
		if (filesFound.length > 0)
		{
			const filePath = filesFound.filter(file => file.includes(FullName))[0];
			if (!filePath) return;

			return filePath;
		}
		return false;
	}
	static GetPathInCWD(relativePath)
	{
		const Path = path.join(process.cwd(), relativePath);
		return Path;
	}
};

module.exports = FileManager;
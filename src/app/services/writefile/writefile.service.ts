import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { Filesystem, Directory, FilesystemPlugin } from '@capacitor/filesystem';
const INVITATION_DIR = 'stored-rating';

@Injectable({
  providedIn: 'root',
})
export class WritefileService {
  private readonly baseDirectory = Directory.External;
  private readonly folderName = 'Pictures'; // You can change this to 'Pictures', 'DCIM', or another suitable directory

  constructor() {
    // this.createFolder()
  }

  async createFolder() {
    await Filesystem.readdir({
      path: this.folderName,
      directory: this.baseDirectory,
    }).then(
      async (result) => {
        // Folder  exists!
      },
      async (err) => {
        // Folder does not exists!
        await Filesystem.mkdir({
          path: this.folderName,
          directory: this.baseDirectory,
        });
      }
    );
  }

  async writeFile(database64: any, name: string, imageUrl?: any) {
    console.log(database64);
    const filePath = `${this.folderName}/${name}_${new Date().getTime()}.jpg`;

    await this.createFolder();
    const file = await Filesystem.writeFile({
      path: filePath,
      data: database64,
      directory: this.baseDirectory,
      recursive: true,
    });

    console.log(file);

    await this.triggerMediaScan(file.uri);
  }

  /**
   * Trigger a media scan for a specific file on Android.
   * @param filePath The path to the file you want to scan.
   */
  async triggerMediaScan(filePath: string): Promise<void> {
    try {
      const platform = (await Device.getInfo()).platform;
      if (platform === 'android') {
        // Trigger media scan for the file
        await Filesystem.stat({
          path: filePath,
          directory: this.baseDirectory,
        });
      } else {
        console.warn('Media scan is not supported on this platform.');
      }
    } catch (error) {
      console.error('Error triggering media scan:', error);
    }
  }
}

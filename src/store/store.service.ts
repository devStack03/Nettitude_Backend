import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';


@Injectable()
export class StoreService {
  azureConnection = "DefaultEndpointsProtocol=https;AccountName=nettitudeteststorage;AccountKey=b5gOkDrKxvCHim9twUluv7cguvDn2T1iyGNPHimEQFjsDcWIPKE894WopfQa1tl/5MKfhN8oTHSkntK9ajHa5w==;EndpointSuffix=core.windows.net";
  containerName = "upload-file";
  

  getBlobClient(imageName:string):BlockBlobClient{
    const blobClientService = BlobServiceClient.fromConnectionString(this.azureConnection);
    const containerClient = blobClientService.getContainerClient(this.containerName);
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  async upload(file:Express.Multer.File){
    const blobClient = this.getBlobClient(file.originalname);
    await blobClient.uploadData(file.buffer);
  }

  async getfileStream(fileName: string){
    const blobClient = this.getBlobClient(fileName);
    var blobDownloaded = await blobClient.download();
    return blobDownloaded.readableStreamBody;
  }

  async delete(filename: string){
    const blobClient = this.getBlobClient(filename);
    await blobClient.deleteIfExists();
  }
}

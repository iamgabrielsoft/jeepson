


export abstract class ZipsonWriter {
    abstract  write (data: string): void; 
    abstract end(): void; 
}


export class ZipsonStringWriter extends ZipsonWriter {
    public value: string = " "; 
    write(data: string): void {
        this.value += data;
    }

    
    end(): void {
        
    }
}
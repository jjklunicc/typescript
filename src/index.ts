import * as CryptoJS from "crypto-js";
import { type } from "os";

class Block{
    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    static calculateBlockHash = (
        index: number, 
        previousHash: string, 
        timestamp: number, 
        data: string
    ): string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();    

    static validateStructure = (aBlock: Block): boolean => 
    typeof aBlock.index ==="number" && 
    typeof aBlock.hash === "string" && 
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timestamp === "number" &&
    typeof aBlock.data === "string";

    constructor(
        index: number,
        hash: string,
        previousHash: string,
        data: string,
        timestamp: number
    ){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

const genesisBlock:Block = new Block(0, "2222222222", "",  "hello", 1234);

let blockchain: [Block] = [genesisBlock];

const getBlockchain = () : Block[] => blockchain;
const getLatestBlock = () : Block => blockchain[blockchain.length-1];
const getNewTimestamp = () : number => Math.round(new Date().getTime()/1000);

const createNewBlock = (data:string) : Block => {
    const previousBlock: Block = getLatestBlock();
    const newIndex : number = previousBlock.index + 1;
    const newTimestamp: number = getNewTimestamp();
    const newHash : string = Block.calculateBlockHash(
        newIndex,
        previousBlock.hash,
        newTimestamp,
        data
    );
    const newBlock : Block = new Block(
        newIndex,
        newHash, 
        previousBlock.hash,
        data,
        newTimestamp);
    addBlock(newBlock);
    return newBlock;
};

const getHashforBlock = (aBlock: Block) :string => Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data);

const isBlockValid = (candidateBlock : Block, previousBlock : Block) : boolean => {
        if(Block.validateStructure(candidateBlock)){
            return false;
        }else if(previousBlock.index + 1 !== candidateBlock.index){
            return false;
        }else if(previousBlock.hash !== candidateBlock.previousHash){
            return false;
        }else if(getHashforBlock(candidateBlock) !== candidateBlock.hash){
            return false;
        }else{
            return true;
        }
    };

const addBlock = (candidateBlock: Block) : void => {
    if(isBlockValid(candidateBlock, getLatestBlock())){
        blockchain.push(candidateBlock);
    }
}

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(blockchain);

export {};
/**
 * Created by bukanxu on 16/9/22.
 */
interface JitazTabInterface{
    header:JitazTabHeader;
    measures:JitazMeasure[];
}

interface JitazTabHeader{
    capo:number;
    tunes:string[];
    time:JitazTime;
    measures:JitazMeasure[];
}

interface JitazTime{
    beats:number;
    type:number;
}

interface JitazMeasure{
    measure:JitazNote[];
    relations:JitazRelation[];
}

interface JitazNote{
    keys:JitazKey[];
    duration:number;
}

interface JitazKey{
    str:number;
    fret:number;
}

interface JitazRelation{
    type:number;
    start:number;
    end:number;
}
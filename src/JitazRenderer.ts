/**
 * Created by bukanxu on 16/9/22.
 */

///<reference path="Jitaz.ts"/>
class JitazRender{
    private mContext:CanvasRenderingContext2D;
    private mNotePosArray:Point[][];

    constructor(canvas:HTMLCanvasElement, private mConfig:JitazConfig ) {
        this.mContext = canvas.getContext("2d");
    }

    public render(tab:JitazTabInterface){
        this.drawBkg(tab.measures.length);
        this.drawHeader(tab.header);

        for(var i:number=0;i<tab.measures.length;i++){
            this.drawMeasureContent(tab.header,tab.measures[i],i);
        }
    }

    private drawBkg(measureLength:number){
        this.mContext.save();
        this.mContext.beginPath();

        this.mContext.fillStyle = '#ffffff';

        this.mContext.lineCap = "rect";
        this.mContext.lineWidth = 1;
        this.mContext.strokeStyle = '#d5d5d5';

        var row_count:number = Math.ceil((measureLength+1)/4);
        var y:number = this.mConfig.mDraw_pos_y0;
        var x:number = this.mConfig.mDraw_pos_x0;

        var l_sp:number = this.mConfig.mTab_line_space;
        var l_w:number = this.mConfig.mTab_line_width;
        var r_h:number = this.mConfig.mTab_row_height;

        this.mContext.fillRect(0,0,this.mConfig.mTab_line_width,row_count*this.mConfig.mTab_row_height);

        for(var i:number=0;i<row_count;i++){

            this.mContext.moveTo(x, y);
            this.mContext.lineTo(x, y+5*l_sp);//a Guitar tab has 6 lines

            for(var j:number=0;j<6;j++){
                this.mContext.moveTo(x, y+j*l_sp);
                this.mContext.lineTo(x+l_w, y+j*l_sp);
            }

            this.mContext.moveTo(x+l_w, y);
            this.mContext.lineTo(x+l_w, y+5*l_sp);

            y += r_h;
        }

        this.mContext.stroke();
        this.mContext.restore();
    }

    private drawHeader(header:JitazTabHeader){
        this.mContext.save();

        this.mContext.fillStyle = '#ffffff';
        var x0:number = this.mConfig.mDraw_pos_x0;
        var y0:number = this.mConfig.mDraw_pos_y0;
        var l_sp:number = this.mConfig.mTab_line_space;
        /// get width of text
        /// draw background rect assuming height of font
        this.mContext.fillRect(x0-1, y0-this.mConfig.mTab_base_font_size/2-1, this.mConfig.mTab_col_width/2, l_sp*5+this.mConfig.mTab_base_font_size);
        this.mContext.fillStyle = '#858585';
        this.mContext.font = this.mConfig.mTab_base_font_size+'px '+this.mConfig.mTab_font_family;
        this.mContext.textBaseline = 'top';
        //console.log(header.tunes);

        var x_shift:number = x0+this.mConfig.mTab_col_width/2-this.mConfig.mTab_base_font_size;
        var y0:number = y0 - this.mConfig.mTab_base_font_size/2 - 1;
        for(var i=0;i<header.tunes.length;i++){
            this.mContext.fillText(header.tunes[i],x_shift,y0+i*l_sp);
        }

        var l_fs = this.mConfig.mTab_base_font_size*2;//large font size
        this.mContext.fillStyle = '#000000';
        this.mContext.font = 'bold '+l_fs+'px '+this.mConfig.mTab_font_family;
        this.mContext.textBaseline = 'top';

        var margin = (5*l_sp-l_fs*2)/2;
        this.mContext.fillText(header.time.beats.toString(),x_shift+this.mConfig.mTab_base_font_size*2,this.mConfig.mDraw_pos_y0+margin-2);
        this.mContext.fillText(header.time.type.toString(),x_shift+this.mConfig.mTab_base_font_size*2,this.mConfig.mDraw_pos_y0+margin+l_fs);

        this.mContext.restore();
    }

    private drawMeasureContent(header:JitazTabHeader,measure:JitazMeasure,index:number){
        this.mContext.save();

        index = index + 1;

        var c_w:number = this.mConfig.mTab_col_width;
        var r_h:number = this.mConfig.mTab_row_height;
        var l_sp:number = this.mConfig.mTab_line_space;

        var x0:number = this.mConfig.mDraw_pos_x0+(index%4)*c_w+this.mConfig.mTab_base_font_size;
        var y0:number = this.mConfig.mDraw_pos_y0 + Math.floor(index/4)*r_h;

        var measureArr:JitazNote[] = measure.measure;

        var measure_pos_arr:Point[] = [];

        var font:string = 'bold '+this.mConfig.mTab_base_font_size+'px '+this.mConfig.mTab_font_family;
        this.mContext.beginPath();
        this.mContext.lineCap = "rect";
        this.mContext.lineWidth = 1;
        this.mContext.strokeStyle = '#000000';
        this.mContext.font = font;
        var center_shift:number = this.mContext.measureText('0').width*0.7;

        var duration:number = 0;
        var beatDuration:number = (c_w-2*this.mConfig.mTab_base_font_size)/header.time.beats;
        var beat_count:number = 0;//a measure beat_count

        var x:number = x0;

        for(var i:number=0;i<measureArr.length;i++) {
            var keys = measureArr[i].keys;

            x += duration;
            //draw keys
            var point:Point = {x:x,y:0};
            for(var k:number=0;k<keys.length;k++){
                var note = keys[k];
                var y:number = y0 - this.mConfig.mTab_base_font_size/2 - 1 + (note.str - 1) * l_sp;

                this.drawText(note.fret.toString(),font , x, y, true);

                if(point.y<y){
                    point.y = y;
                }
            }

            //save keys pos
            measure_pos_arr.push(point);

            this.mContext.moveTo(x + center_shift, y0 + l_sp * 6);
            this.mContext.lineTo(x + center_shift, y0 + l_sp * 8);

            duration =  header.time.type/measureArr[i].duration*beatDuration;

            beat_count += header.time.type/measureArr[i].duration;

            if(beat_count != Math.floor(beat_count)){
                for(var j=0;j<1/duration;j++){
                    this.mContext.lineTo(x + center_shift, y0 + l_sp * 8 - j*this.mConfig.mTab_base_font_size/2);
                    this.mContext.lineTo(x + center_shift+duration, y0 + l_sp * 8 - j*this.mConfig.mTab_base_font_size/2);
                    this.mContext.lineTo(x + center_shift, y0 + l_sp * 8 - j*this.mConfig.mTab_base_font_size/2-1);
                    this.mContext.lineTo(x + center_shift+duration, y0 + l_sp * 8 - j*this.mConfig.mTab_base_font_size/2-1);
                    this.mContext.lineTo(x + center_shift, y0 + l_sp * 8 - j*this.mConfig.mTab_base_font_size/2-2);
                    this.mContext.lineTo(x + center_shift+duration, y0 + l_sp * 8 - j*this.mConfig.mTab_base_font_size/2-2);
                    //this.mContext.lineTo(x + center_shift, y0 + l_sp * 8-1 - j*this.mConfig.mTab_base_font_size/2);
                }
            }
        }

        this.mContext.stroke();
        this.mContext.restore();

        if(measure.relations){
            this.drawRelation(measure.relations,measure_pos_arr);
        }
    }

    private drawText(txt:string, font:string, x:number, y:number,hasBkg?:boolean) {
        this.mContext.save();

        this.mContext.font = font;
        this.mContext.textBaseline = 'top';

        if(hasBkg){
            this.mContext.fillStyle = '#ffffff';
            var width = this.mContext.measureText(txt).width*1.4;
            this.mContext.fillRect(x-width*0.2, y, width, parseInt(font,10));
        }

        this.mContext.fillStyle = '#000';
        this.mContext.fillText(txt, x, y);

        this.mContext.restore();
    }

    private drawRelation(relations:JitazRelation[],pos_map:Point[]){
        this.mContext.save();

        this.mContext.font = 'bold '+this.mConfig.mTab_base_font_size+'px '+this.mConfig.mTab_font_family;
        this.mContext.fillStyle = '#000000';
        for(var i:number=0;i<relations.length;i++) {
            var relation = relations[i];
            this.drawCurve(pos_map[relation.start],pos_map[relation.end]);
        }

        this.mContext.restore();
    }

    private drawCurve(p1:Point,p2:Point,direction?:number){
        console.log(p1.x-p2.x,p1,p2);
        if(direction === undefined){
            direction = 1;
        }

        var center_shift:number = this.mContext.measureText('0').width*0.5;

        p1.x = p1.x+center_shift;
        p2.x = p2.x+center_shift;

        var x_sp = this.mConfig.mTab_line_space/2;
        var y_sp = Math.abs(p1.x-p2.x)/4;

        this.mContext.beginPath();
        this.mContext.moveTo(p1.x, p1.y);
        this.mContext.bezierCurveTo(
            p1.x + x_sp,
            p1.y - y_sp*direction,
            p2.x - x_sp,
            p2.y - y_sp*direction,
            p2.x,
            p2.y
        );
        this.mContext.bezierCurveTo(
            p2.x - x_sp,
            p2.y - (y_sp+2)*direction,
            p1.x + x_sp,
            p1.y - (y_sp+2)*direction,
            p1.x,
            p1.y
        );
        this.mContext.stroke();
        this.mContext.closePath();
        this.mContext.fill();
    }
}
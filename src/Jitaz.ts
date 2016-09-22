///<reference path="HiDPICanvas.ts"/>
///<reference path="JitazTabInterface.ts"/>
///<reference path="JitazRenderer.ts"/>
class Jitaz {
    private mCanvas:HTMLCanvasElement;
    private mRender:JitazRender;
    private mConfig:JitazConfig;
    constructor(private mContainer:string, config) {
        this.mConfig = this.initConfig(config);
        this.mCanvas = HiDPICanvas.createHiDPICanvas(this.mConfig.mWidth,this.mConfig.mHeight);
        document.getElementById(mContainer).appendChild(this.mCanvas);
        this.mRender = new JitazRender(this.mCanvas,this.mConfig);
    }

    public render(tab:JitazTabInterface){
        if(tab === undefined){
            console.error('the method of render cannot accept null parameter');
            return;
        }
        this.mRender.render(tab);
    }

    private initConfig(obj?: any): JitazConfig {
        if (obj === undefined) obj = {};

        var width:number = obj.mWidth === undefined ? 960 : obj.mWidth;
        var tab_line_width:number = obj.mTab_line_width === undefined ? 850:obj.mTab_line_width;

        return {
            mWidth: width,
            mHeight: obj.mHeight === undefined ? 600 : obj.mHeight,

            mTab_line_width:tab_line_width,
            mTab_line_space:obj.mTab_line_space === undefined ? 11:obj.mTab_line_space,

            mTab_row_height:obj.mTab_row_height === undefined ? 160:obj.mTab_row_height,
            mTab_col_width:obj.mTab_col_width === undefined ? tab_line_width/4:obj.mTab_col_width,

            mDraw_pos_x0:obj.mDraw_pos_x0 === undefined ? (width-tab_line_width)/2:obj.mDraw_pos_x0,
            mDraw_pos_y0:obj.mDraw_pos_y0 === undefined ? 48:obj.mDraw_pos_y0,

            mTab_font_family:obj.mTab_font_family === undefined ? 'Times':obj.mTab_font_family,
            mTab_base_font_size:obj.mTab_base_font_size === undefined ? 12:obj.mTab_base_font_size
        }
    }
}

interface JitazConfig {
    mWidth:number;
    mHeight:number;

    mTab_line_width:number;
    mTab_line_space:number;

    mTab_row_height:number;
    mTab_col_width:number;

    mDraw_pos_x0:number;
    mDraw_pos_y0:number;

    mTab_font_family:string;
    mTab_base_font_size:number;
}

interface Point{
    x:number;
    y:number;
}
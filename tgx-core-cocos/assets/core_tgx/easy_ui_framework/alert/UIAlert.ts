import { UIController } from "../UIController";
import { UIMgr } from "../UIMgr";

import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('tgxLayout_UIAlert')
export class Layout_UIAlert extends Component {

    @property(Label)
    title:Label;

    @property(Label)
    content:Label;

    @property(Button)
    btnOK:Button;

    @property(Button)
    btnCancel:Button;
}

export class UIAlertOptions {
    private _title?: string;
    private _content?: string;
    private _showCancel?: boolean;
    private _cbClick?: Function;
    private _cbClickThisArg?: Function;

    setTitle(title: string): UIAlertOptions {
        this._title = title;
        return this;
    }

    onClick(cb: (isOK: boolean) => void, thisArg?: any): UIAlertOptions {
        this._cbClick = cb;
        this._cbClickThisArg = thisArg;
        return this;
    }
}

export class UIAlert extends UIController {
    private _options: UIAlertOptions;

    public static show(content: string, showCancel?: boolean): UIAlertOptions {
        let opts = new UIAlertOptions() as any;
        opts._content = content;
        opts._showCancel = showCancel;
        UIMgr.inst.showUI(UIAlert, (alert: UIAlert) => {
            alert.init(opts);
        }) as UIAlert;
        return opts;
    }

    public get layout():Layout_UIAlert{
        return this._layout as Layout_UIAlert;
    }

    private init(opts: UIAlertOptions) {
        this._options = opts;
        let options = this._options as any as { _title: string, _content: string, _showCancel: boolean };
        let layout = this.layout as Layout_UIAlert;
        if (options.hasOwnProperty('title')) {
            layout.title.string = options._title || '';
        }

        layout.content.string = options._content || '';
        layout.btnCancel.node.active = options._showCancel;
        if (!options._showCancel) {
            let pos = layout.btnOK.node.position;
            layout.btnOK.node.setPosition(0, pos.y, pos.z);
        }
    }

    protected onCreated(): void {
        let layout = this.layout as Layout_UIAlert;
        this.onButtonEvent(layout.btnOK, () => {
            this.close();
            let options = this._options as any as { _cbClick: Function, _cbClickThisArg: any };
            if (options._cbClick) {
                options._cbClick.call(options._cbClickThisArg, true);
            }
        });

        this.onButtonEvent(layout.btnCancel, () => {
            this.close();
            let options = this._options as any as { _cbClick: Function, _cbClickThisArg: any };
            if (options._cbClick) {
                options._cbClick.call(options._cbClickThisArg, false);
            }
        });
    }
}
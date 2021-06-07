import {
    Lazyload, Swipe, SwipeItem, Col, Row, Field, Tag, Button, RadioGroup, Radio, Loading, Overlay, Cell, CellGroup, Collapse, CollapseItem, Icon,
    Notify
} from 'vant'

export default {
    install(App) {
        App.use(Col);
        App.use(Row);
        App.use(Field);
        App.use(Tag);
        App.use(Button);
        App.use(RadioGroup);
        App.use(Radio);
        App.use(Loading);
        App.use(Overlay);
        App.use(Cell);
        App.use(CellGroup);
        App.use(Collapse);
        App.use(CollapseItem);
        App.use(Icon);
        App.use(Swipe);
        App.use(SwipeItem);
        App.use(Notify);
        App.use(Lazyload, {
            lazyComponent: true
        });
    }
}
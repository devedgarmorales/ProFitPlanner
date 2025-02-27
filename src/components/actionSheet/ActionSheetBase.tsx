import React from 'react';
import ActionSheet, {ActionSheetRef} from 'react-native-actions-sheet';

interface ActionSheetBaseProps {
    children: React.ReactNode;
    actionSheetRef: React.RefObject<ActionSheetRef>;
    closeable: boolean;
    gesture: boolean;
    showBackgroundColor: boolean;
}

const ActionSheetBase: React.FC<ActionSheetBaseProps> = ({children, ...props}) => {

    return (
        <ActionSheet
            ref={props.actionSheetRef}
            gestureEnabled={props.gesture}
            closable={props.closeable}
            isModal={true}
            indicatorStyle={{
                width: 100,
                alignSelf: "center",
            }}
            {...(props.showBackgroundColor ? { overlayColor: "transparent" } : {})}
            {...props}>
            {children}
        </ActionSheet>
    );
}

export default ActionSheetBase;

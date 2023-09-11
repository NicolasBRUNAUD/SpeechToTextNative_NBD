import { Component, ReactNode, createElement } from "react";
import { TextStyle, ViewStyle , Text} from "react-native";

import { Style } from "@mendix/pluggable-widgets-tools";

import Voice from '@react-native-voice/voice';



import { SpeechToTextNativeNbdProps } from "../typings/SpeechToTextNativeNbdProps";

export interface CustomStyle extends Style {
    container: ViewStyle;
    label: TextStyle;
}



        /* AVAILABLE commands
        Voice.isAvailable();
        Voice.start(locale);
        Voice.stop();
        Voice.cancel();
        Voice.destroy();
        Voice.removeAllListeners();
        Voice.isRecognizing();
        */


export class SpeechToTextNativeNbd extends Component<SpeechToTextNativeNbdProps<CustomStyle>> {
   

    constructor(props: SpeechToTextNativeNbdProps<CustomStyle> | Readonly<SpeechToTextNativeNbdProps<CustomStyle>>) {
        super(props);

        Voice.onSpeechStart = onSpeechStartsData => {
            console.debug("onSpeechStartsData : " +JSON.stringify(onSpeechStartsData));
            this.props.SessionStatus.setValue("Listening");
        }
        /*
        Voice.onSpeechRecognized = onSpeechRecognizedData => {
            console.debug("onSpeechRecognizedData : " +JSON.stringify(onSpeechRecognizedData));
        }
        */
        Voice.onSpeechEnd = onSpeechEndData => {
            console.debug("onSpeechEndData : " +JSON.stringify(onSpeechEndData));
            this.props.SessionStatus.setValue("Finished");
            Voice.destroy();
        }
        Voice.onSpeechError = onSpeechErrorData => {
            var  DataString=JSON.stringify(onSpeechErrorData);
            console.debug("onSpeechErrorData : " +DataString);
            this.props.RawResult.setValue(DataString);
            this.props.SessionStatus.setValue("Error");    
            this.props.onSpeechErrorAction?.execute();
            Voice.destroy();
        }
        Voice.onSpeechResults =  onSpeechResultsData => {
            if (onSpeechResultsData) {
                // Set Result in attribute
                var  DataString=JSON.stringify(onSpeechResultsData);
                console.debug("onSpeechResultsData : " +DataString);
                this.props.RawResult.setValue(DataString);
                // Trigger action  nanoflow
                this.props.onVoiceResultAction?.execute();
            }
        };
        Voice.onSpeechPartialResults = onSpeechPartialResultsData => {
            if (onSpeechPartialResultsData) {
                // Set Result in attribute
                var  DataString=onSpeechPartialResultsData?.value?.[0];
                this.props.SpeechPartialResults.setValue(DataString); 
            }
        }


    } 

    componentDidMount() {
        // The widget automatically starts listening when it's loaded. 
        console.debug("SpeechToTextNbd_Start");
        Voice.start(this.props.InputLanguage.value);
    }

    render(): ReactNode {
        return  <Text/>;        
    }
}

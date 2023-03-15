using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using UnityEngine;

//text colors based on min and max values in the slider
[System.Serializable]
public class TextState{
	public string[] texts;
	public Color color;
	public float min;
}

public class EncouragingText : MonoBehaviour {
    
	public TextState[] states;
	
	public Animator anim;
	public Text label;
	public float duration;
	
	//check which text state fits the bar fill amount and use that one for the text and color
	public void ShowText(float fillAmount){
		TextState state = null;
		
		for(int i = 0; i < states.Length; i++){
			if(fillAmount > states[i].min){
				if(i == states.Length - 1 || fillAmount <= states[i + 1].min)
					state = states[i];
			}
		}
		
		if(state != null)
			StartCoroutine(Show(state));
	}
	
	//use a random text and color from the correct text state based on the bar fill amount
	IEnumerator Show(TextState state){
		label.color = state.color;
		label.text = state.texts[Random.Range(0, state.texts.Length)];
		
		anim.SetBool("Show", true);
		
		yield return new WaitForSeconds(duration);
		
		anim.SetBool("Show", false);
	}
}

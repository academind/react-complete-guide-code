using UnityEngine;
using System.Collections;
using UnityEditor;

[CustomEditor(typeof(OutfitGenerator))]
public class OutfitGeneratorEditor : Editor {
	
    public override void OnInspectorGUI(){
        OutfitGenerator gen = (OutfitGenerator)target;
		
		if(GUILayout.Button("Generate new"))
            gen.GenerateNew();

        DrawDefaultInspector ();
    }
}